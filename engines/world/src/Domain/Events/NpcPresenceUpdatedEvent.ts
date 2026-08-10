import { IDomainEvent } from "@nova-x-ai/core";

export class NpcPresenceUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_WORLD_NpcPresenceUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly worldId: string,
        public readonly characterId: string,
        public readonly locationId: string,
        public readonly previousLocationId: string | null,
        public readonly action: "arrived" | "departed",
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
