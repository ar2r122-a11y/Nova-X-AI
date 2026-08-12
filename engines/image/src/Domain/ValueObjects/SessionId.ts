
export class SessionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): SessionId {
        return new SessionId(`ses-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): SessionId {
        if (!value || value.trim().length === 0) {
            throw new Error("SessionId cannot be empty.");
        }
        return new SessionId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: SessionId): boolean {
        return this.value === other.value;
    }
}
