import type { IDomainEvent } from "../IEventBus";

export class KernelShutdownEvent implements IDomainEvent {
    public readonly eventType = "KernelShutdownEvent";

    public readonly timestamp: number;

    public readonly correlationId: string;

    constructor(
        correlationId: string,
        timestamp: number = Date.now()
    ) {
        this.correlationId = correlationId;
        this.timestamp = timestamp;
    }
}