import { IDomainEvent } from "@nova-x-ai/core";

export class GlobalVariableUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_WORLD_GlobalVariableUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly worldId: string,
        public readonly key: string,
        public readonly previousValue: unknown,
        public readonly newValue: unknown,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
