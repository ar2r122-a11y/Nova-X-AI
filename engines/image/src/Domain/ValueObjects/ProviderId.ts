
export class ProviderId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): ProviderId {
        return new ProviderId(`prov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): ProviderId {
        if (!value || value.trim().length === 0) {
            throw new Error("ProviderId cannot be empty.");
        }
        return new ProviderId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ProviderId): boolean {
        return this.value === other.value;
    }
}
