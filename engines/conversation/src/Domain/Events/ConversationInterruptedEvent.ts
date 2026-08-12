import { IDomainEvent } from "@nova-x-ai/core";
import { ConversationId } from "../ValueObjects/ConversationId";
import { SessionId } from "../ValueObjects/SessionId";

export class ConversationInterruptedEvent implements IDomainEvent {
    readonly eventType = "EVT_CONV_ConversationInterrupted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly conversationId: ConversationId,
        public readonly sessionId: SessionId,
        public readonly interruptionType: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
