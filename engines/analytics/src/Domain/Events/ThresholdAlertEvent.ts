import { IDomainEvent } from "@nova-x-ai/core";
import { MetricId } from "../ValueObjects/MetricId";

export class ThresholdAlertEvent implements IDomainEvent {
    readonly eventType = "EVT_ANALYTICS_ThresholdAlert";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly metricId: MetricId,
        public readonly metricName: string,
        public readonly threshold: number,
        public readonly currentValue: number,
        timestamp: number = Date.now(),
        correlationId: string = `alert-${Date.now()}`
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
