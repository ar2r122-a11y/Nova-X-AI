import { IDomainEvent } from "@nova-x-ai/core";

export class AnalyticsOptOutChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_ANALYTICS_OptOutChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly optedOut: boolean,
        timestamp: number = Date.now(),
        correlationId: string = `optout-${Date.now()}`
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
