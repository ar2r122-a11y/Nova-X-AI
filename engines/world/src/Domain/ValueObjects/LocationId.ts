export class LocationId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): LocationId {
        if (!value || value.trim().length === 0) {
            throw new Error("LocationId cannot be empty.");
        }
        return new LocationId(value);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: LocationId): boolean {
        return this.value === other.value;
    }
}
