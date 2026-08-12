export class TranscriptionRequestId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static generate(): TranscriptionRequestId {
        return new TranscriptionRequestId(`trans-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static create(value: string): TranscriptionRequestId {
        if (!value || value.trim().length === 0) {
            throw new Error("TranscriptionRequestId cannot be empty.");
        }
        return new TranscriptionRequestId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TranscriptionRequestId): boolean {
        return this.value === other.value;
    }
}
