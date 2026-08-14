export class SpanId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): SpanId {
        if (!value || value.trim().length === 0) {
            throw new Error("SpanId cannot be empty.");
        }
        return new SpanId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }
}
