export class MetricValue {
    private readonly value: number;
    private readonly unit: string;

    private constructor(value: number, unit: string) {
        this.value = value;
        this.unit = unit;
    }

    static create(value: number, unit: string): MetricValue {
        if (typeof value !== "number" || !isFinite(value)) {
            throw new Error("Metric value must be a finite number.");
        }
        return new MetricValue(value, unit);
    }

    getValue(): number {
        return this.value;
    }

    getUnit(): string {
        return this.unit;
    }
}
