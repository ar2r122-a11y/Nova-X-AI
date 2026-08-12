import type { IEventBus } from "@nova-x-ai/core";
import { IConversationEngine } from "../Contracts/IConversationEngine";
import { ConversationApplicationService } from "../Application/Services/ConversationApplicationService";
import { InMemoryConversationRepository } from "../Infrastructure/Persistence/InMemoryConversationRepository";
import { InMemoryMessageRepository } from "../Infrastructure/Persistence/InMemoryMessageRepository";
import { InMemorySessionRepository } from "../Infrastructure/Persistence/InMemorySessionRepository";
import { ConversationDomainService } from "../Domain/Services/ConversationDomainService";
import { ContextBuilder } from "../Domain/Services/ContextBuilder";
import { LanguageDetector } from "../Domain/Services/LanguageDetector";
import { ConversationSummarizer } from "../Domain/Services/ConversationSummarizer";
import { ConversationQuotaPolicy } from "../Domain/Policies/ConversationQuotaPolicy";
import { RateLimitPolicy } from "../Domain/Policies/RateLimitPolicy";
import { ContextWindowPolicy } from "../Domain/Policies/ContextWindowPolicy";
import { StreamingPolicy } from "../Domain/Policies/StreamingPolicy";
import { ToolExecutionPolicy } from "../Domain/Policies/ToolExecutionPolicy";
import { IConversationRepository } from "../Domain/Repositories/IConversationRepository";
import { IMessageRepository } from "../Domain/Repositories/IMessageRepository";
import { ISessionRepository } from "../Domain/Repositories/ISessionRepository";
import { ConversationSessionDto } from "../Application/DTO/ConversationSessionDto";
import { MessageDto } from "../Application/DTO/MessageDto";
import { MessageAcknowledgementDto } from "../Application/DTO/MessageAcknowledgementDto";
import { ConversationSummaryDto } from "../Application/DTO/ConversationSummaryDto";

export class ConversationEngine implements IConversationEngine {
    readonly eventBus: IEventBus;
    readonly conversationRepository: IConversationRepository;
    readonly messageRepository: IMessageRepository;
    readonly sessionRepository: ISessionRepository;
    readonly domainService: ConversationDomainService;
    readonly quotaPolicy: ConversationQuotaPolicy;
    readonly rateLimitPolicy: RateLimitPolicy;
    readonly contextWindowPolicy: ContextWindowPolicy;
    readonly streamingPolicy: StreamingPolicy;
    readonly toolExecutionPolicy: ToolExecutionPolicy;
    private readonly applicationService: ConversationApplicationService;

    constructor(eventBus: IEventBus) {
        this.eventBus = eventBus;
        this.conversationRepository = new InMemoryConversationRepository();
        this.messageRepository = new InMemoryMessageRepository();
        this.sessionRepository = new InMemorySessionRepository();
        this.domainService = new ConversationDomainService(
            new ContextBuilder({ maxContextTokens: 4096 }),
            new LanguageDetector(),
            new ConversationSummarizer()
        );
        this.quotaPolicy = new ConversationQuotaPolicy(10);
        this.rateLimitPolicy = new RateLimitPolicy(30);
        this.contextWindowPolicy = new ContextWindowPolicy(4096);
        this.streamingPolicy = new StreamingPolicy(4, 10);
        this.toolExecutionPolicy = new ToolExecutionPolicy(15_000);
        this.applicationService = new ConversationApplicationService(
            this.conversationRepository,
            this.sessionRepository,
            this.rateLimitPolicy
        );
    }

    async startSession(command: {
        conversationId: string;
        ownerId: string;
        participantIds: string[];
        initialPrompt?: string;
        claims: { roles: string[]; permissions: string[] };
        metadata?: Record<string, unknown>;
    }): Promise<ConversationSessionDto> {
        return this.applicationService.startSession(command);
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
        return this.applicationService.postMessage(command);
    }

    async interrupt(command: {
        conversationId: string;
        sessionId: string;
        interruptionType: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        return this.applicationService.interrupt(command);
    }

    async cancelStream(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        return this.applicationService.cancelStream(command);
    }

    async retryTurn(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void> {
        return this.applicationService.retryTurn(command);
    }

    async getMessageHistory(query: {
        conversationId: string;
        requesterId: string;
        limit?: number;
        offset?: number;
    }): Promise<MessageDto[]> {
        return this.applicationService.getMessageHistory(query);
    }

    async getConversation(query: { conversationId: string; requesterId: string }): Promise<ConversationSessionDto | null> {
        return this.applicationService.getConversation(query);
    }

    async getStreamStatus(query: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
    }): Promise<{ state: string; isActive: boolean } | null> {
        return this.applicationService.getStreamStatus(query);
    }

    async getConversationSummary(_conversationId: string, _requesterId: string): Promise<ConversationSummaryDto | null> {
        const aggregate = await this.conversationRepository.getById(_conversationId);
        if (!aggregate) {
            return null;
        }
        const summary = aggregate.getSummary();
        if (!summary) {
            return null;
        }
        return new ConversationSummaryDto(
            _conversationId,
            aggregate.getSessionId().getValue(),
            summary,
            aggregate.getMessages().length,
            aggregate.getTurns().length,
            aggregate.getCreatedAt()
        );
    }

    async takeSnapshot(conversationId: string): Promise<object> {
        const aggregate = await this.conversationRepository.getById(conversationId);
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }
        return aggregate.getSnapshot();
    }

    async restoreFromSnapshot(conversationId: string, snapshot: object): Promise<void> {
        const aggregate = await this.conversationRepository.getById(conversationId);
        if (!aggregate) {
            throw new Error(`Conversation ${conversationId} not found.`);
        }
        aggregate.restoreFromSnapshot(snapshot);
        await this.conversationRepository.save(aggregate);
    }

    async shutdown(): Promise<void> {
        // Cleanup resources if needed
    }
}
