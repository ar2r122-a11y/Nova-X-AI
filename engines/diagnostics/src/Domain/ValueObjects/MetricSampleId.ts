export class MetricSampleId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): MetricSampleId {
        if (!value || value.trim().length === 0) {
            throw new Error("MetricSampleId cannot be empty.");
        }
        return new MetricSampleId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }
}
