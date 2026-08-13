import type { IEventBus } from "@nova-x-ai/core";
import type { IConversationRepository } from "../Domain/Repositories/IConversationRepository";
import type { IMessageRepository } from "../Domain/Repositories/IMessageRepository";
import type { ISessionRepository } from "../Domain/Repositories/ISessionRepository";
import type { IConversationDomainService } from "../Domain/Services/ConversationDomainService";
import type { ConversationQuotaPolicy } from "../Domain/Policies/ConversationQuotaPolicy";
import type { RateLimitPolicy } from "../Domain/Policies/RateLimitPolicy";
import type { ContextWindowPolicy } from "../Domain/Policies/ContextWindowPolicy";
import type { StreamingPolicy } from "../Domain/Policies/StreamingPolicy";
import type { ToolExecutionPolicy } from "../Domain/Policies/ToolExecutionPolicy";
import type { ConversationSessionDto } from "../Application/DTO/ConversationSessionDto";
import type { MessageAcknowledgementDto } from "../Application/DTO/MessageAcknowledgementDto";
import type { MessageDto } from "../Application/DTO/MessageDto";
import type { ConversationSummaryDto } from "../Application/DTO/ConversationSummaryDto";
import type { AIRouter } from "@nova-x-ai/ai-router";

export interface IConversationEngine {
    readonly eventBus: IEventBus;
    readonly conversationRepository: IConversationRepository;
    readonly messageRepository: IMessageRepository;
    readonly sessionRepository: ISessionRepository;
    readonly domainService: IConversationDomainService;
    readonly quotaPolicy: ConversationQuotaPolicy;
    readonly rateLimitPolicy: RateLimitPolicy;
    readonly contextWindowPolicy: ContextWindowPolicy;
    readonly streamingPolicy: StreamingPolicy;
    readonly toolExecutionPolicy: ToolExecutionPolicy;
    readonly aiRouter: AIRouter;

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
    executeTurn(command: {
        conversationId: string;
        sessionId: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): Promise<void>;
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
    getConversationSummary(conversationId: string, requesterId: string): Promise<ConversationSummaryDto | null>;
    takeSnapshot(conversationId: string): Promise<object>;
    restoreFromSnapshot(conversationId: string, snapshot: object): Promise<void>;
    shutdown(): Promise<void>;
}
