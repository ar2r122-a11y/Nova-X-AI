import { IDomainEvent } from "@nova-x-ai/core";

export interface MoodShiftedEventPayload {
    characterId: string;
    previousMood: string;
    newMood: string;
    moodStability: number;
    timestamp: number;
}

export class MoodShiftedEvent implements IDomainEvent {
    readonly eventType = "EVT_EMOT_MoodShifted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly characterId: string,
        public readonly previousMood: string,
        public readonly newMood: string,
        public readonly moodStability: number,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
