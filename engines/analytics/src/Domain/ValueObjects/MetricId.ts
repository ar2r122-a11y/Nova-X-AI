export class MetricId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static generate(): MetricId {
        return new MetricId(`metric-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    static fromString(value: string): MetricId {
        return new MetricId(value);
    }

    getValue(): string {
        return this.value;
    }
}
