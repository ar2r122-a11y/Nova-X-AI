export class SynthesisRequestId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static generate(): SynthesisRequestId {
        return new SynthesisRequestId(`synth-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static create(value: string): SynthesisRequestId {
        if (!value || value.trim().length === 0) {
            throw new Error("SynthesisRequestId cannot be empty.");
        }
        return new SynthesisRequestId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: SynthesisRequestId): boolean {
        return this.value === other.value;
    }
}
