import type { IDomainEvent } from "../IEventBus";

export class ModuleLoadedEvent implements IDomainEvent {
    public readonly eventType = "ModuleLoadedEvent";

    public readonly timestamp: number;

    public readonly correlationId: string;

    public readonly moduleName: string;

    constructor(
        moduleName: string,
        correlationId: string,
        timestamp: number = Date.now()
    ) {
        this.moduleName = moduleName;
        this.correlationId = correlationId;
        this.timestamp = timestamp;
    }
}