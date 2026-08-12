import { IDomainEvent } from "@nova-x-ai/core";
import { ConversationId } from "../ValueObjects/ConversationId";
import { SessionId } from "../ValueObjects/SessionId";

export class StreamChunkEvent implements IDomainEvent {
    readonly eventType = "EVT_CONV_StreamChunkEvent";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly conversationId: ConversationId,
        public readonly sessionId: SessionId,
        public readonly sequence: number,
        public readonly delta: string,
        public readonly isLast: boolean,
        timestamp: number,
        correlationId: string,
        public readonly model?: string,
        public readonly usage?: {
            readonly promptTokens: number;
            readonly completionTokens: number;
            readonly totalTokens: number;
        }
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
