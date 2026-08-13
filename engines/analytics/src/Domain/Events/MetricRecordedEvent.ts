import { IDomainEvent } from "@nova-x-ai/core";
import { MetricId } from "../ValueObjects/MetricId";

export class MetricRecordedEvent implements IDomainEvent {
    readonly eventType = "EVT_ANALYTICS_MetricRecorded";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly metricId: MetricId,
        public readonly metricType: string,
        public readonly engineSource?: string,
        timestamp: number = Date.now(),
        correlationId: string = `metric-${Date.now()}`
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
