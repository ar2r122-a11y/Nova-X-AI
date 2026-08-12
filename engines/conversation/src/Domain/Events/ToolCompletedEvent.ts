import { IDomainEvent } from "@nova-x-ai/core";
import { ConversationId } from "../ValueObjects/ConversationId";
import { SessionId } from "../ValueObjects/SessionId";

export class ToolCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_CONV_ToolCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly conversationId: ConversationId,
        public readonly sessionId: SessionId,
        public readonly toolCallId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
