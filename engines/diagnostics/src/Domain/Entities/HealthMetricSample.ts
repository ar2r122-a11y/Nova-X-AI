import { MetricSampleId } from "../ValueObjects/MetricSampleId";

export class HealthMetricSample {
    private readonly sampleId: MetricSampleId;
    private readonly engineName: string;
    private readonly metricName: string;
    private readonly value: number;
    private readonly unit: string;
    private readonly timestamp: number;
    private readonly tags: Record<string, string>;

    constructor(opts: {
        sampleId: MetricSampleId;
        engineName: string;
        metricName: string;
        value: number;
        unit: string;
        timestamp: number;
        tags: Record<string, string>;
    }) {
        this.sampleId = opts.sampleId;
        this.engineName = opts.engineName;
        this.metricName = opts.metricName;
        this.value = opts.value;
        this.unit = opts.unit;
        this.timestamp = opts.timestamp;
        this.tags = opts.tags;
    }

    public getSampleId(): MetricSampleId {
        return this.sampleId;
    }

    public getEngineName(): string {
        return this.engineName;
    }

    public getMetricName(): string {
        return this.metricName;
    }

    public getValue(): number {
        return this.value;
    }

    public getUnit(): string {
        return this.unit;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getTags(): Record<string, string> {
        return this.tags;
    }
}
