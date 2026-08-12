/**
 * Nova X AI
 * Conversation Engine
 * Domain Aggregate: ConversationAggregate
 *
 * The ConversationAggregate is the aggregate root for all conversation
 * lifecycle, turn management, participant coordination, and context
 * compression operations.
 */

import { IDomainEvent } from "@nova-x-ai/core";
import {
    ConversationId,
    SessionId,
    MessageId,
    ParticipantId,
    TokenCount,
    TokenBudget,
    ConversationState,
    StreamState,
    InterruptionType,
    CompressionStrategy
} from "../ValueObjects";
import { Participant } from "../Entities/Participant";
import { Message } from "../Entities/Message";
import { Turn } from "../Entities/Turn";
import { ToolCall } from "../Entities/ToolCall";
import { StreamChunkRecord } from "../Entities/StreamChunkRecord";
import {
    ConversationStartedEvent,
    MessagePostedEvent,
    ConversationInterruptedEvent,
    ConversationExecutionFailedEvent,
    ConversationSummarizedEvent,
    ToolInvokedEvent,
    ToolCompletedEvent,
    ToolFailedEvent,
    ConversationEndedEvent
} from "../Events";

export class ConversationAggregate {
    private readonly conversationId: ConversationId;
    private readonly sessionId: SessionId;
    private readonly participants: Map<string, Participant> = new Map();
    private readonly messages: Message[] = [];
    private readonly turns: Turn[] = [];
    private readonly toolCalls: Map<string, ToolCall> = new Map();
    private readonly streamChunks: Map<number, StreamChunkRecord> = new Map();
    private conversationState: ConversationState;
    private streamState: StreamState;
    private tokenBudget: TokenBudget;
    private compressionStrategy: CompressionStrategy;
    private currentSequence: number = 0;
    private currentTurnSequence: number = 0;
    private readonly createdAt: number;
    private lastActivityAt: number;
    private readonly uncommittedEvents: IDomainEvent[] = [];
    private interruptionCheckpoint?: object;
    private summary?: string;
    private retryCount: number = 0;
    private maxRetries: number = 3;

    constructor(
        conversationId: ConversationId,
        sessionId: SessionId,
        tokenBudget: TokenBudget,
        compressionStrategy: CompressionStrategy,
        maxRetries: number = 3
    ) {
        this.conversationId = conversationId;
        this.sessionId = sessionId;
        this.conversationState = ConversationState.idle();
        this.streamState = StreamState.inactive();
        this.tokenBudget = tokenBudget;
        this.compressionStrategy = compressionStrategy;
        this.createdAt = Date.now();
        this.lastActivityAt = Date.now();
        this.maxRetries = maxRetries;
    }

    public getId(): ConversationId {
        return this.conversationId;
    }

    public getSessionId(): SessionId {
        return this.sessionId;
    }

    public getState(): ConversationState {
        return this.conversationState;
    }

    public getStreamState(): StreamState {
        return this.streamState;
    }

    public getMessages(): readonly Message[] {
        return [...this.messages];
    }

    public getTurns(): readonly Turn[] {
        return [...this.turns];
    }

    public getParticipants(): Participant[] {
        return Array.from(this.participants.values());
    }

    public getToolCalls(): readonly ToolCall[] {
        return Array.from(this.toolCalls.values());
    }

    public getSummary(): string | undefined {
        return this.summary;
    }

    public getRetryCount(): number {
        return this.retryCount;
    }

    public getMaxRetries(): number {
        return this.maxRetries;
    }

    public getCreatedAt(): number {
        return this.createdAt;
    }

    public getLastActivityAt(): number {
        return this.lastActivityAt;
    }

    public start(initiatorId: ParticipantId): void {
        if (!this.conversationState.equals(ConversationState.idle())) {
            throw new Error("Conversation has already been started.");
        }

        this.conversationState = ConversationState.waitingForAI();
        this.lastActivityAt = Date.now();

        this.uncommittedEvents.push(
            new ConversationStartedEvent(
                this.conversationId,
                this.sessionId,
                initiatorId,
                Date.now(),
                `conv-start-${Date.now()}`
            )
        );
    }

    public addParticipant(participant: Participant): void {
        this.participants.set(participant.getId().getValue(), participant);
        this.lastActivityAt = Date.now();
    }

    public removeParticipant(participantId: ParticipantId): void {
        const participant = this.participants.get(participantId.getValue());
        if (participant) {
            this.participants.set(participantId.getValue(), participant.deactivate());
        }
        this.lastActivityAt = Date.now();
    }

    public postMessage(
        message: Message,
        authorId: ParticipantId
    ): Message {
        if (this.conversationState.equals(ConversationState.ended())) {
            throw new Error("Cannot post message to an ended conversation.");
        }
        if (this.conversationState.equals(ConversationState.streaming())) {
            throw new Error("Cannot post message while streaming is active.");
        }

        this.messages.push(message);
        this.lastActivityAt = Date.now();

        const totalTokens = this.calculateTotalTokens();
        if (totalTokens.isGreaterThan(this.tokenBudget.getTotalBudget())) {
            this.compressContext();
        }

        this.uncommittedEvents.push(
            new MessagePostedEvent(
                this.conversationId,
                this.sessionId,
                message.getId(),
                authorId,
                message.getRole().getValue(),
                message.getContent(),
                message.getTokenCount().getValue(),
                Date.now(),
                `msg-post-${Date.now()}`,
                message.getLanguageHint()
            )
        );

        return message;
    }

    public beginTurn(userMessageId: MessageId): Turn {
        if (!this.conversationState.equals(ConversationState.waitingForAI()) &&
            !this.conversationState.equals(ConversationState.idle())) {
            throw new Error("Cannot begin turn in current conversation state.");
        }

        this.conversationState = ConversationState.waitingForAI();
        this.currentTurnSequence += 1;
        const turn = Turn.create(
            `turn-${this.currentTurnSequence}`,
            this.currentTurnSequence,
            userMessageId,
            Date.now()
        );
        this.turns.push(turn);
        this.lastActivityAt = Date.now();
        return turn;
    }

    public completeTurn(turn: Turn, assistantMessageId: MessageId): void {
        const existingTurn = this.turns.find(t => t.getTurnId() === turn.getTurnId());
        if (existingTurn) {
            this.turns[this.turns.indexOf(existingTurn)] = turn.withAssistantMessage(assistantMessageId);
        }
        this.conversationState = ConversationState.idle();
        this.lastActivityAt = Date.now();
    }

    public startStreaming(): void {
        if (!this.conversationState.equals(ConversationState.waitingForAI())) {
            throw new Error("Cannot start streaming in current conversation state.");
        }

        this.conversationState = ConversationState.streaming();
        this.streamState = StreamState.active();
        this.lastActivityAt = Date.now();
    }

    public appendStreamChunk(chunk: StreamChunkRecord): void {
        if (!this.streamState.equals(StreamState.active())) {
            throw new Error("Cannot append stream chunk when stream is not active.");
        }

        this.streamChunks.set(chunk.getSequence().getValue(), chunk);
        this.lastActivityAt = Date.now();
    }

    public completeStreaming(): void {
        this.streamState = StreamState.completed();
        this.conversationState = ConversationState.idle();
        this.lastActivityAt = Date.now();
    }

    public failStreaming(reason: string): void {
        this.streamState = StreamState.failed();
        this.conversationState = ConversationState.error();

        this.uncommittedEvents.push(
            new ConversationExecutionFailedEvent(
                this.conversationId,
                this.sessionId,
                reason,
                Date.now(),
                `conv-fail-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();
    }

    public interrupt(interruptionType: InterruptionType): object {
        if (this.conversationState.equals(ConversationState.ended())) {
            throw new Error("Cannot interrupt an ended conversation.");
        }

        this.interruptionCheckpoint = this.createCheckpoint();
        this.conversationState = ConversationState.interrupted();
        this.streamState = StreamState.cancelled();

        this.uncommittedEvents.push(
            new ConversationInterruptedEvent(
                this.conversationId,
                this.sessionId,
                interruptionType.getValue(),
                Date.now(),
                `conv-interrupt-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();

        return this.interruptionCheckpoint;
    }

    public resumeStreaming(): void {
        if (!this.conversationState.equals(ConversationState.interrupted())) {
            throw new Error("Cannot resume streaming from current conversation state.");
        }

        this.conversationState = ConversationState.streaming();
        this.streamState = StreamState.recovering();
        this.lastActivityAt = Date.now();
    }

    public recordToolInvocation(toolCall: ToolCall): void {
        this.toolCalls.set(toolCall.getToolCallId(), toolCall);
        this.conversationState = ConversationState.toolExecution();
        this.lastActivityAt = Date.now();

        this.uncommittedEvents.push(
            new ToolInvokedEvent(
                this.conversationId,
                this.sessionId,
                toolCall.getToolCallId(),
                toolCall.getToolName(),
                Date.now(),
                `tool-invoke-${Date.now()}`
            )
        );
    }

    public recordToolCompletion(toolCallId: string, result: unknown): void {
        const toolCall = this.toolCalls.get(toolCallId);
        if (toolCall) {
            const completed = (toolCall as any).markCompleted(result);
            this.toolCalls.set(toolCallId, completed);
        }

        this.uncommittedEvents.push(
            new ToolCompletedEvent(
                this.conversationId,
                this.sessionId,
                toolCallId,
                Date.now(),
                `tool-complete-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();
    }

    public recordToolFailure(toolCallId: string, error: string): void {
        const toolCall = this.toolCalls.get(toolCallId);
        if (toolCall) {
            const failed = (toolCall as any).markFailed(error);
            this.toolCalls.set(toolCallId, failed);
        }

        this.uncommittedEvents.push(
            new ToolFailedEvent(
                this.conversationId,
                this.sessionId,
                toolCallId,
                error,
                Date.now(),
                `tool-fail-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();
    }

    public end(): void {
        if (this.conversationState.equals(ConversationState.ended())) {
            throw new Error("Conversation has already been ended.");
        }

        this.conversationState = ConversationState.ended();
        this.streamState = StreamState.inactive();

        this.uncommittedEvents.push(
            new ConversationEndedEvent(
                this.conversationId,
                this.sessionId,
                this.messages.length,
                this.turns.length,
                Date.now(),
                `conv-end-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();
    }

    public setSummary(summary: string): void {
        this.summary = summary;

        this.uncommittedEvents.push(
            new ConversationSummarizedEvent(
                this.conversationId,
                this.sessionId,
                summary,
                Date.now(),
                `conv-summary-${Date.now()}`
            )
        );
        this.lastActivityAt = Date.now();
    }

    public incrementRetry(): void {
        this.retryCount += 1;
        this.lastActivityAt = Date.now();
    }

    public canRetry(): boolean {
        return this.retryCount < this.maxRetries;
    }

    public getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    public commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    public getSnapshot(): object {
        return {
            conversationId: this.conversationId.getValue(),
            sessionId: this.sessionId.getValue(),
            conversationState: this.conversationState.getValue(),
            streamState: this.streamState.getValue(),
            compressionStrategy: this.compressionStrategy.getValue(),
            currentSequence: this.currentSequence,
            currentTurnSequence: this.currentTurnSequence,
            createdAt: this.createdAt,
            lastActivityAt: this.lastActivityAt,
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            summary: this.summary,
            interruptionCheckpoint: this.interruptionCheckpoint,
            participants: Array.from(this.participants.values()).map(p => ({
                id: p.getId().getValue(),
                participantType: p.getParticipantType(),
                displayName: p.getDisplayName(),
                priority: p.getPriority(),
                isActive: p.isCurrentlyActive(),
                joinedAt: p.getJoinedAt()
            })),
            messages: this.messages.map(m => ({
                id: m.getId().getValue(),
                role: m.getRole().getValue(),
                content: m.getContent(),
                timestamp: m.getTimestamp(),
                tokenCount: m.getTokenCount().getValue(),
                metadata: m.getMetadata(),
                languageHint: m.getLanguageHint()
            })),
            turns: this.turns.map(t => ({
                turnId: t.getTurnId(),
                sequenceNumber: t.getSequenceNumber(),
                userMessageId: t.getUserMessageId().getValue(),
                assistantMessageId: t.getAssistantMessageId()?.getValue(),
                toolCalls: t.getToolCalls(),
                tokenCount: t.getTokenCount().getValue(),
                startedAt: t.getStartedAt(),
                completedAt: t.getCompletedAt()
            }))
        };
    }

    public restoreFromSnapshot(snapshot: object): void {
        const snap = snapshot as Record<string, unknown>;
        this.conversationState = ConversationState.fromString(snap.conversationState as string);
        this.streamState = StreamState.fromString(snap.streamState as string);
        this.compressionStrategy = CompressionStrategy.fromString(snap.compressionStrategy as string);
        this.currentSequence = snap.currentSequence as number;
        this.currentTurnSequence = snap.currentTurnSequence as number;
        this.lastActivityAt = snap.lastActivityAt as number;
        this.retryCount = (snap.retryCount as number) || 0;
        this.maxRetries = (snap.maxRetries as number) || 3;
        this.summary = snap.summary as string | undefined;
        this.interruptionCheckpoint = snap.interruptionCheckpoint as object | undefined;

        this.participants.clear();
        const participants = snap.participants as Array<Record<string, unknown>>;
        for (const p of participants) {
            this.participants.set(p.id as string, Participant.create(
                ParticipantId.create(p.id as string),
                p.participantType as string,
                p.displayName as string,
                p.priority as number,
                p.isActive as boolean,
                p.joinedAt as number
            ));
        }
    }

    private createCheckpoint(): object {
        return {
            conversationState: this.conversationState.getValue(),
            streamState: this.streamState.getValue(),
            messages: this.messages.map(m => m.getContent()),
            streamChunks: Array.from(this.streamChunks.values()).map(c => c.getContent()),
            timestamp: Date.now()
        };
    }

    private calculateTotalTokens(): TokenCount {
        let total = TokenCount.zero();
        for (const message of this.messages) {
            total = total.add(message.getTokenCount());
        }
        return total;
    }

    private compressContext(): void {
        if (this.compressionStrategy.equals(CompressionStrategy.none())) {
            return;
        }
        if (this.messages.length <= 2) {
            return;
        }
        const retained = [this.messages[0], this.messages[this.messages.length - 1]];
        this.messages.length = 0;
        this.messages.push(...retained);
        this.currentSequence = 0;
    }
}
