import { IDomainEvent } from "@nova-x-ai/core";

export interface EmotionalStateChangedEventPayload {
    characterId: string;
    previousPrimaryEmotion: string;
    newPrimaryEmotion: string;
    pleasure: number;
    arousal: number;
    dominance: number;
    timestamp: number;
}

export class EmotionalStateChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_EMOT_EmotionalStateChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: string,
        public readonly previousPrimaryEmotion: string,
        public readonly newPrimaryEmotion: string,
        public readonly pleasure: number,
        public readonly arousal: number,
        public readonly dominance: number,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
