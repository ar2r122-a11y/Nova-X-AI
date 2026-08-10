import { IDomainEvent } from "@nova-x-ai/core";

export class WorldInitializedEvent implements IDomainEvent {
    readonly eventType = "EVT_WORLD_WorldInitialized";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly worldId: string,
        public readonly worldName: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
