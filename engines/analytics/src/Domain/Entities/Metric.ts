import { MetricId } from "../ValueObjects/MetricId";
import { MetricType } from "../ValueObjects/MetricType";
import { MetricValue } from "../ValueObjects/MetricValue";
import { FeatureTag } from "../ValueObjects/FeatureTag";
import { PerformanceTag } from "../ValueObjects/PerformanceTag";
import { PIIMask } from "../ValueObjects/PIIMask";

export interface MetricProps {
    id: MetricId;
    type: MetricType;
    name: string;
    value: MetricValue;
    tags: string[];
    featureTag?: FeatureTag;
    performanceTag?: PerformanceTag;
    piiMask: PIIMask;
    recordedAt: number;
    sessionId?: string;
    engineSource?: string;
    correlationId?: string;
}

export class Metric {
    private readonly props: MetricProps;

    private constructor(props: MetricProps) {
        this.props = props;
    }

    static create(props: Omit<MetricProps, "id" | "recordedAt">): Metric {
        const now = Date.now();
        return new Metric({
            ...props,
            id: MetricId.generate(),
            recordedAt: now
        });
    }

    static reconstitute(props: MetricProps): Metric {
        return new Metric(props);
    }

    getId(): MetricId {
        return this.props.id;
    }

    getType(): MetricType {
        return this.props.type;
    }

    getName(): string {
        return this.props.name;
    }

    getValue(): MetricValue {
        return this.props.value;
    }

    getTags(): string[] {
        return this.props.tags;
    }

    getFeatureTag(): FeatureTag | undefined {
        return this.props.featureTag;
    }

    getPerformanceTag(): PerformanceTag | undefined {
        return this.props.performanceTag;
    }

    getPIIMask(): PIIMask {
        return this.props.piiMask;
    }

    getRecordedAt(): number {
        return this.props.recordedAt;
    }

    getSessionId(): string | undefined {
        return this.props.sessionId;
    }

    getEngineSource(): string | undefined {
        return this.props.engineSource;
    }

    getCorrelationId(): string | undefined {
        return this.props.correlationId;
    }

    toSnapshot(): MetricProps {
        return { ...this.props };
    }
}
