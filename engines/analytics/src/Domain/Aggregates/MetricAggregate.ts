import { Metric } from "../Entities/Metric";
import { TelemetryEvent } from "../Entities/TelemetryEvent";
import { OptOutStatus } from "../ValueObjects/OptOutStatus";
import { MetricType } from "../ValueObjects/MetricType";
import { MetricValue } from "../ValueObjects/MetricValue";
import { FeatureTag } from "../ValueObjects/FeatureTag";
import { PerformanceTag } from "../ValueObjects/PerformanceTag";
import { PIIMask } from "../ValueObjects/PIIMask";

export interface MetricAggregateProps {
    metrics: Metric[];
    telemetryEvents: TelemetryEvent[];
    settings: { optOutStatus: OptOutStatus };
}

export class MetricAggregate {
    private metrics: Metric[];
    private telemetryEvents: TelemetryEvent[];
    private settings: { optOutStatus: OptOutStatus };

    private constructor(props: MetricAggregateProps) {
        this.metrics = props.metrics;
        this.telemetryEvents = props.telemetryEvents;
        this.settings = props.settings;
    }

    static create(): MetricAggregate {
        return new MetricAggregate({
            metrics: [],
            telemetryEvents: [],
            settings: { optOutStatus: OptOutStatus.create(false) }
        });
    }

    static reconstitute(props: MetricAggregateProps): MetricAggregate {
        return new MetricAggregate(props);
    }

    recordMetric(
        type: MetricType,
        name: string,
        value: number,
        unit: string,
        tags: string[],
        featureTag?: string,
        performanceTag?: string,
        piiMask?: PIIMask,
        sessionId?: string,
        engineSource?: string,
        correlationId?: string
    ): Metric {
        if (this.settings.optOutStatus.isOptedOut()) {
            throw new Error("Analytics is opted out. Cannot record metrics.");
        }

        const metric = Metric.create({
            type,
            name,
            value: MetricValue.create(value, unit),
            tags,
            featureTag: featureTag ? FeatureTag.create(featureTag) : undefined,
            performanceTag: performanceTag ? PerformanceTag.create(performanceTag) : undefined,
            piiMask: piiMask ?? PIIMask.none(),
            sessionId,
            engineSource,
            correlationId
        });

        this.metrics.push(metric);
        return metric;
    }

    recordTelemetryEvent(
        eventType: string,
        payload: Record<string, unknown>,
        piiMask: PIIMask,
        correlationId?: string,
        engineSource?: string
    ): TelemetryEvent {
        if (this.settings.optOutStatus.isOptedOut()) {
            throw new Error("Analytics is opted out. Cannot record telemetry events.");
        }

        const telemetryEvent = TelemetryEvent.create({
            eventType,
            payload,
            piiMask,
            correlationId,
            engineSource
        });

        this.telemetryEvents.push(telemetryEvent);
        return telemetryEvent;
    }

    getMetrics(): Metric[] {
        return [...this.metrics];
    }

    getTelemetryEvents(): TelemetryEvent[] {
        return [...this.telemetryEvents];
    }

    getMetricsByType(type: MetricType): Metric[] {
        return this.metrics.filter((m) => m.getType() === type);
    }

    getMetricsByFeature(feature: string): Metric[] {
        return this.metrics.filter((m) => m.getFeatureTag()?.getValue() === feature);
    }

    getMetricsByPerformance(performance: string): Metric[] {
        return this.metrics.filter((m) => m.getPerformanceTag()?.getValue() === performance);
    }

    getSettings(): { optOutStatus: OptOutStatus } {
        return { ...this.settings };
    }

    updateOptOut(optedOut: boolean): void {
        this.settings.optOutStatus = OptOutStatus.create(optedOut);
    }

    pruneExpiredMetrics(retentionMs: number): { prunedCount: number } {
        const cutoff = Date.now() - retentionMs;
        const before = this.metrics.length;
        this.metrics = this.metrics.filter((m) => m.getRecordedAt() > cutoff);
        return { prunedCount: before - this.metrics.length };
    }

    pruneExpiredTelemetry(retentionMs: number): { prunedCount: number } {
        const cutoff = Date.now() - retentionMs;
        const before = this.telemetryEvents.length;
        this.telemetryEvents = this.telemetryEvents.filter((e) => e.getTimestamp() > cutoff);
        return { prunedCount: before - this.telemetryEvents.length };
    }

    clear(): void {
        this.metrics = [];
        this.telemetryEvents = [];
    }
}
