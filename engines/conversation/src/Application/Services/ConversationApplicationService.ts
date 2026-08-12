import { ConversationAggregate } from "../../Domain/Aggregates/ConversationAggregate";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";
import { SessionId } from "../../Domain/ValueObjects/SessionId";
import { ParticipantId } from "../../Domain/ValueObjects/ParticipantId";
import { Participant } from "../../Domain/Entities/Participant";
import { TokenCount } from "../../Domain/ValueObjects/TokenCount";
import { StreamChunkSequence } from "../../Domain/ValueObjects/StreamChunkSequence";
import { StreamChunkRecord } from "../../Domain/Entities/StreamChunkRecord";
import { ToolCall } from "../../Domain/Entities/ToolCall";
import { MessageId } from "../../Domain/ValueObjects/MessageId";
import { RateLimitPolicy } from "../../Domain/Policies/RateLimitPolicy";
import { SafetyPolicy } from "../../Domain/Policies/SafetyPolicy";
import { IConversationRepository } from "../../Domain/Repositories/IConversationRepository";
import { ISessionRepository } from "../../Domain/Repositories/ISessionRepository";
import { ConversationSessionDto } from "../DTO/ConversationSessionDto";
import { MessageDto } from "../DTO/MessageDto";
import { MessageAcknowledgementDto } from "../DTO/MessageAcknowledgementDto";

export interface IConversationApplicationService {
    startSession(command: {
        conversationId: string;
        ownerId: string;
        participantIds: string[];
        initialPrompt?: string;
        claims: { roles: string[]; permissions: string[] };
        metadata?: Record<string, unknown>;
    }): Promise<ConversationSessionDto>;
    postMessage(command: {
        conversationId: string;
        sessionId: string;
        authorId: string;
        content: string;
        role: string;
        languageHint?: string;
        claims: { roles: string[]; permissions: string[] };
        metadata?: Record<string, unknown>;
    }): Promise<MessageAcknowledgementDto>;
    interrupt(command: {
        conversationId: string;
        sessionId: string;
        interruptionType: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void>;
    cancelStream(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void>;
    retryTurn(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void>;
    getMessageHistory(query: {
        conversationId: string;
        requesterId: string;
        limit?: number;
        offset?: number;
    }): Promise<MessageDto[]>;
    getConversation(query: { conversationId: string; requesterId: string }): Promise<ConversationSessionDto | null>;
    getStreamStatus(query: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
    }): Promise<{ state: string; isActive: boolean } | null>;
    appendStreamChunk(conversationId: string, sessionId: string, delta: string, sequence: number, isLast: boolean): Promise<void>;
    completeStreaming(conversationId: string, sessionId: string): Promise<void>;
    recordToolCall(
        conversationId: string,
        sessionId: string,
        toolCallId: string,
        parentMessageId: string,
        toolName: string,
        args: Record<string, unknown>
    ): Promise<void>;
    recordToolResult(
        conversationId: string,
        sessionId: string,
        toolCallId: string,
        result: unknown,
        isError: boolean
    ): Promise<void>;
}

export class ConversationApplicationService implements IConversationApplicationService {
    constructor(
        private readonly conversationRepository: IConversationRepository,
        private readonly sessionRepository: ISessionRepository,
        private readonly rateLimitPolicy: RateLimitPolicy
    ) {}

    async startSession(command: {
        conversationId: string;
        ownerId: string;
        participantIds: string[];
        initialPrompt?: string;
        claims: { roles: string[]; permissions: string[] };
        metadata?: Record<string, unknown>;
    }): Promise<ConversationSessionDto> {
        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (aggregate) {
            return ConversationSessionDto.fromAggregate(aggregate);
        }

        const sessionId = SessionId.generate();
        const tokenBudget = TokenCount.create(4096);
        const compressionStrategy = { getValue: () => "none" } as any;

        const newAggregate = new ConversationAggregate(
            conversationId,
            sessionId,
            { getTotalBudget: () => tokenBudget, getSystemAllocation: () => TokenCount.create(1024), getResponseBuffer: () => TokenCount.create(2048), getContextWindow: () => TokenCount.create(1024) } as any,
            compressionStrategy
        );

        for (const participantId of command.participantIds) {
            newAggregate.addParticipant(Participant.create(
                ParticipantId.create(participantId),
                "user",
                participantId,
                1,
                true,
                Date.now()
            ));
        }

        const initiatorId = ParticipantId.create(command.participantIds[0]);
        newAggregate.start(initiatorId);

        await this.conversationRepository.save(newAggregate);
        await this.sessionRepository.save({
            sessionId: sessionId.getValue(),
            conversationId: conversationId.getValue(),
            state: newAggregate.getState().getValue(),
            createdAt: Date.now(),
            lastActivityAt: Date.now(),
            metadata: command.metadata || {}
        });

        return ConversationSessionDto.fromAggregate(newAggregate);
    }

    async postMessage(command: {
        conversationId: string;
        sessionId: string;
        authorId: string;
        content: string;
        role: string;
        languageHint?: string;
        claims: { roles: string[]; permissions: string[] };
        metadata?: Record<string, unknown>;
    }): Promise<MessageAcknowledgementDto> {
        if (!this.rateLimitPolicy.canProceed()) {
            throw new Error("Rate limit exceeded.");
        }

        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        const sanitizedContent = SafetyPolicy.sanitizeInput(command.content);
        const estimatedTokens = TokenCount.create(Math.max(1, Math.ceil(sanitizedContent.length / 4)));
        const message = {
            getId: () => MessageId.generate(),
            getRole: () => ({ getValue: () => command.role } as any),
            getContent: () => sanitizedContent,
            getTimestamp: () => Date.now(),
            getTokenCount: () => estimatedTokens,
            getMetadata: () => command.metadata || {},
            getLanguageHint: () => command.languageHint
        } as any;

        const authorId = ParticipantId.create(command.authorId);
        aggregate.postMessage(message, authorId);

        await this.conversationRepository.save(aggregate);

        return new MessageAcknowledgementDto(
            message.getId().getValue(),
            command.conversationId,
            Date.now(),
            "posted"
        );
    }

    async interrupt(command: {
        conversationId: string;
        sessionId: string;
        interruptionType: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        const interruptionType = { getValue: () => command.interruptionType } as any;
        aggregate.interrupt(interruptionType);
        await this.conversationRepository.save(aggregate);
    }

    async cancelStream(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        await this.interrupt({
            conversationId: command.conversationId,
            sessionId: command.sessionId,
            interruptionType: "cancelStream",
            requesterId: command.requesterId,
            claims: command.claims
        });
    }

    async retryTurn(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        if (!aggregate.canRetry()) {
            throw new Error("Maximum retry attempts exceeded.");
        }

        aggregate.incrementRetry();
        await this.conversationRepository.save(aggregate);
    }

    async getMessageHistory(query: {
        conversationId: string;
        requesterId: string;
        limit?: number;
        offset?: number;
    }): Promise<MessageDto[]> {
        const conversationId = ConversationId.create(query.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            return [];
        }

        const messages = aggregate.getMessages();
        const offset = Math.max(0, query.offset || 0);
        const limit = Math.max(1, query.limit || 50);
        const paginated = messages.slice(offset, offset + limit);

        return paginated.map(message => MessageDto.fromEntity(
            message as any,
            query.conversationId,
            aggregate.getSessionId().getValue(),
            query.requesterId
        ));
    }

    async getConversation(query: { conversationId: string; requesterId: string }): Promise<ConversationSessionDto | null> {
        const conversationId = ConversationId.create(query.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            return null;
        }
        return ConversationSessionDto.fromAggregate(aggregate);
    }

    async getStreamStatus(query: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
    }): Promise<{ state: string; isActive: boolean } | null> {
        const conversationId = ConversationId.create(query.conversationId);
        const aggregate = await this.conversationRepository.getById(conversationId.getValue());
        if (!aggregate) {
            return null;
        }
        return {
            state: aggregate.getStreamState().getValue(),
            isActive: aggregate.getStreamState().getValue() === "active"
        };
    }

    async appendStreamChunk(conversationId: string, _sessionId: string, delta: string, sequence: number, isLast: boolean): Promise<void> {
        const convId = ConversationId.create(conversationId);
        const aggregate = await this.conversationRepository.getById(convId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }

        const chunk = StreamChunkRecord.create(
            StreamChunkSequence.create(sequence),
            delta,
            isLast,
            false
        );
        aggregate.appendStreamChunk(chunk);
        await this.conversationRepository.save(aggregate);
    }

    async completeStreaming(conversationId: string, _sessionId: string): Promise<void> {
        const convId = ConversationId.create(conversationId);
        const aggregate = await this.conversationRepository.getById(convId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }
        aggregate.completeStreaming();
        await this.conversationRepository.save(aggregate);
    }

    async recordToolCall(
        conversationId: string,
        _sessionId: string,
        toolCallId: string,
        parentMessageId: string,
        toolName: string,
        args: Record<string, unknown>
    ): Promise<void> {
        const convId = ConversationId.create(conversationId);
        const aggregate = await this.conversationRepository.getById(convId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }

        const messageId = MessageId.create(parentMessageId);
        const toolCall = ToolCall.create(toolCallId, messageId, toolName, args);
        aggregate.recordToolInvocation(toolCall);
        await this.conversationRepository.save(aggregate);
    }

    async recordToolResult(
        conversationId: string,
        _sessionId: string,
        toolCallId: string,
        result: unknown,
        isError: boolean
    ): Promise<void> {
        const convId = ConversationId.create(conversationId);
        const aggregate = await this.conversationRepository.getById(convId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }

        if (isError) {
            aggregate.recordToolFailure(toolCallId, result as string);
        } else {
            aggregate.recordToolCompletion(toolCallId, result);
        }
        await this.conversationRepository.save(aggregate);
    }
}
