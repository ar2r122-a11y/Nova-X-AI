/**
 * Nova X AI
 * AI Router
 * Domain Service Interface: IAiProvider
 *
 * Port interface (abstraction) that keeps provider-specific APIs
 * from leaking into the domain layer.
 * SDS §126: Provider-specific APIs must not leak into the domain layer.
 */
import { ProviderId } from "../ValueObjects/ProviderId";
import { ProviderHealth } from "../ValueObjects/ProviderHealth";
import { TokenBudget } from "../ValueObjects/TokenBudget";

export interface PromptRequest {

    readonly prompt: string;

    readonly model: string;

    readonly maxTokens: number;

    readonly temperature: number;

    readonly context?: PromptContext;

    readonly stream?: boolean;

}

export interface PromptContext {

    readonly systemPrompt?: string;

    readonly conversationHistory?: ReadonlyArray<ConversationMessage>;

    readonly variables?: Record<string, unknown>;

    readonly memoryContext?: string;

    readonly emotionContext?: string;

    readonly relationshipContext?: string;

    readonly worldContext?: string;

    readonly storyContext?: string;

}

export interface ConversationMessage {

    readonly role: "system" | "user" | "assistant" | "tool";

    readonly content: string;

}

export interface PromptTokenUsage {

    readonly promptTokens: number;

    readonly completionTokens: number;

    readonly totalTokens: number;

}

export interface PromptResult {

    readonly content: string;

    readonly model: string;

    readonly providerId: string;

    readonly usage: PromptTokenUsage;

    readonly finishReason: string;

    readonly latencyMs: number;

}

export interface StreamChunk {

    readonly content: string;

    readonly delta: string;

    readonly isLast: boolean;

    readonly model?: string;

    readonly usage?: PromptTokenUsage;

}

export interface ProviderCapabilities {

    readonly supportsStreaming: boolean;

    readonly supportsTools: boolean;

    readonly maxContextTokens: number;

    readonly supportedModels: readonly string[];

}

export interface IAiProvider {

    readonly id: ProviderId;

    readonly name: string;

    readonly capabilities: ProviderCapabilities;

    isAvailable(): boolean;

    getHealth(): ProviderHealth;

    executePrompt(request: PromptRequest): Promise<PromptResult>;

    executePromptStream(
        request: PromptRequest
    ): AsyncIterable<StreamChunk>;

    markHealthy(): void;

    markUnhealthy(error: string): void;

    getBudget(): TokenBudget;

}
