import { IDomainEvent } from "@nova-x-ai/core";

export class PIIStrippedEvent implements IDomainEvent {
    readonly eventType = "EVT_ANALYTICS_PIIStripped";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly fieldsStripped: string[],
        timestamp: number = Date.now(),
        correlationId: string = `pii-${Date.now()}`
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
