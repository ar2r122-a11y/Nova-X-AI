import { IDomainEvent } from "@nova-x-ai/core";

export interface EmotionalBreakpointEventPayload {
    characterId: string;
    stabilityIndex: number;
    breakpointThreshold: number;
    triggeredAt: number;
    recommendedAction: string;
}

export class EmotionalBreakpointReachedEvent implements IDomainEvent {
    readonly eventType = "EVT_EMOT_EmotionalBreakpointReached";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: string,
        public readonly stabilityIndex: number,
        public readonly breakpointThreshold: number,
        public readonly recommendedAction: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
