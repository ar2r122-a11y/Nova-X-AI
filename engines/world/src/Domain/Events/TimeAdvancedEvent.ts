import { IDomainEvent } from "@nova-x-ai/core";

export class TimeAdvancedEvent implements IDomainEvent {
    readonly eventType = "EVT_WORLD_TimeAdvanced";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly worldId: string,
        public readonly previousTime: number,
        public readonly newTime: number,
        public readonly previousDate: string,
        public readonly newDate: string,
        public readonly previousSeason: string,
        public readonly newSeason: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
