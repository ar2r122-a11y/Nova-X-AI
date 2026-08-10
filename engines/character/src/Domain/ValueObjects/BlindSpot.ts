
export class BlindSpot {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(spot: string): BlindSpot {
        if (!spot || spot.trim().length === 0) {
            throw new Error("BlindSpot cannot be empty.");
        }
        return new BlindSpot(spot);
    }

    public static fromString(value: string): BlindSpot {
        return BlindSpot.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: BlindSpot): boolean {
        return this.value === other.value;
    }
}
