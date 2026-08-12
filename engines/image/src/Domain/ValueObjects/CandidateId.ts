
export class CandidateId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): CandidateId {
        return new CandidateId(`cnd-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): CandidateId {
        if (!value || value.trim().length === 0) {
            throw new Error("CandidateId cannot be empty.");
        }
        return new CandidateId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CandidateId): boolean {
        return this.value === other.value;
    }
}
