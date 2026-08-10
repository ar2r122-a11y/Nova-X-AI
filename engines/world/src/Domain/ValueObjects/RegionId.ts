export class RegionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): RegionId {
        if (!value || value.trim().length === 0) {
            throw new Error("RegionId cannot be empty.");
        }
        return new RegionId(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: RegionId): boolean {
        return this.value === other.value;
    }
}
