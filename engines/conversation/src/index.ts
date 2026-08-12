/**
 * Nova X AI
 * Conversation Engine
 * Public barrel export
 *
 * Exports the stable public surface of the Conversation Engine.
 * Internal implementation details are NOT re-exported here.
 */

export { ConversationEngine } from "./Presentation/ConversationEngine";
export { ConversationEngineModule } from "./Presentation/ConversationEngineModule";

export type {
    IConversationEngine,
    IConversationWorker,
    IStreamingWorker,
    IContextCompressor,
    ISchedulerWorker
} from "./Contracts";

export { ConversationAggregate } from "./Domain/Aggregates/ConversationAggregate";

export type {
    ConversationId,
    SessionId,
    MessageId,
    ParticipantId,
    TokenCount,
    TokenBudget,
    LanguageCode,
    MessageRole,
    ConversationState,
    StreamState,
    InterruptionType,
    RetryStrategy,
    ToolCallStatus,
    CompressionStrategy,
    PriorityLevel,
    StreamChunkSequence
} from "./Domain/ValueObjects";

export type {
    ConversationDomainService,
    IContextBuilder,
    ITurnEvaluator,
    ILanguageDetector,
    ITokenBudgetAllocator,
    IConversationSummarizer
} from "./Domain/Services";

export { RateLimitPolicy } from "./Domain/Policies/RateLimitPolicy";
export { SafetyPolicy } from "./Domain/Policies/SafetyPolicy";
export { ContextWindowPolicy } from "./Domain/Policies/ContextWindowPolicy";
export { ConversationQuotaPolicy } from "./Domain/Policies/ConversationQuotaPolicy";
export { RetryPolicy } from "./Domain/Policies/RetryPolicy";
export { StreamingPolicy } from "./Domain/Policies/StreamingPolicy";
export { ToolExecutionPolicy } from "./Domain/Policies/ToolExecutionPolicy";
export { ConversationRetentionPolicy } from "./Domain/Policies/ConversationRetentionPolicy";
export { MultiParticipantPolicy } from "./Domain/Policies/MultiParticipantPolicy";

export {
    StartSessionCommand,
    PostMessageCommand,
    InterruptCommand,
    CancelStreamCommand,
    AbortToolCallCommand,
    RetryTurnCommand,
    RegenerateResponseCommand,
    ContinueGenerationCommand,
    ResumeStreamingCommand,
    ForceCompletionCommand,
    ScheduleConversationCommand,
    UpdateConversationStateCommand
} from "./Application/Commands";

export {
    GetMessageHistoryQuery,
    GetConversationQuery,
    GetConversationSessionQuery,
    GetStreamStatusQuery,
    GetConversationSummaryQuery
} from "./Application/Queries";

export {
    ConversationSessionDto,
    MessageDto,
    StreamChunkDto,
    TokenBudgetDto,
    ConversationSummaryDto,
    MessageAcknowledgementDto
} from "./Application/DTO";

export {
    ConversationStartedEvent,
    MessagePostedEvent,
    ConversationInterruptedEvent,
    ConversationExecutionFailedEvent,
    StreamChunkEvent,
    ConversationSummarizedEvent,
    ToolInvokedEvent,
    ToolCompletedEvent,
    ToolFailedEvent,
    ConversationEndedEvent
} from "./Domain/Events";
