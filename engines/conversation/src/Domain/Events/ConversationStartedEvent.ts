import { IDomainEvent } from "@nova-x-ai/core";
import { ConversationId } from "../ValueObjects/ConversationId";
import { SessionId } from "../ValueObjects/SessionId";
import { ParticipantId } from "../ValueObjects/ParticipantId";

export class ConversationStartedEvent implements IDomainEvent {
    readonly eventType = "EVT_CONV_ConversationStarted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly conversationId: ConversationId,
        public readonly sessionId: SessionId,
        public readonly initiatorId: ParticipantId,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
