
export class Desire {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(description: string): Desire {
        if (!description || description.trim().length === 0) {
            throw new Error("Desire description cannot be empty.");
        }
        return new Desire(description);
    }

    public static fromString(value: string): Desire {
        return Desire.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Desire): boolean {
        return this.value === other.value;
    }
}
