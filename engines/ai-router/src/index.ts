/**
 * Nova X AI
 * AI Router — Public barrel export
 *
 * Exports the stable public surface of the AI Router engine.
 * SDS §126: AI Router enforces provider abstraction, routing, and token budgeting.
 */

// Application
export { AIRouter } from "./Application/AIRouter";
export type { AIRouterOptions } from "./Application/AIRouter";

// Domain
export {
    ProviderId,
    ProviderHealth,
    ProviderHealthStatus,
    TokenBudget,
    PromptModel,
    ProviderSelector,
    CircuitBreaker,
    CircuitState,
    ProviderRegistration,
    ProviderRegisteredEvent,
    ProviderStatusChangedEvent
} from "./Domain/index";
export type {
    ProviderSelectionStrategy,
    IAiProvider,
    PromptRequest,
    PromptContext,
    ConversationMessage,
    PromptTokenUsage,
    PromptResult,
    StreamChunk,
    ProviderCapabilities,
    IProviderRepository,
    ProviderSelectionContext,
    ProviderSelectionResult,
    ProviderSelectionReason,
    CircuitBreakerConfig,
    ProviderInfo
} from "./Domain/index";

// Infrastructure
export { InMemoryProviderRepository } from "./Infrastructure/Repositories/InMemoryProviderRepository";
export { FakeAiProvider } from "./Infrastructure/Providers/FakeAiProvider";
export { OpenRouterAiProvider } from "./Infrastructure/Providers/OpenRouterAiProvider";
export type { OpenRouterProviderConfig } from "./Infrastructure/Providers/OpenRouterAiProvider";
