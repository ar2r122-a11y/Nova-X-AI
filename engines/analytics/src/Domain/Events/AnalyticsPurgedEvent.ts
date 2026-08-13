import { IDomainEvent } from "@nova-x-ai/core";

export class AnalyticsPurgedEvent implements IDomainEvent {
    readonly eventType = "EVT_ANALYTICS_Purged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly metricsPurged: number,
        public readonly telemetryPurged: number,
        timestamp: number = Date.now(),
        correlationId: string = `purge-${Date.now()}`
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
