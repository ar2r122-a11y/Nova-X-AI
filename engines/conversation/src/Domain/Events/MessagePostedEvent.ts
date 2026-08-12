import { IDomainEvent } from "@nova-x-ai/core";
import { ConversationId } from "../ValueObjects/ConversationId";
import { SessionId } from "../ValueObjects/SessionId";
import { MessageId } from "../ValueObjects/MessageId";
import { ParticipantId } from "../ValueObjects/ParticipantId";

export class MessagePostedEvent implements IDomainEvent {
    readonly eventType = "EVT_CONV_MessagePosted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly conversationId: ConversationId,
        public readonly sessionId: SessionId,
        public readonly messageId: MessageId,
        public readonly authorId: ParticipantId,
        public readonly role: string,
        public readonly content: string,
        public readonly tokenCount: number,
        timestamp: number,
        correlationId: string,
        public readonly languageHint?: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
