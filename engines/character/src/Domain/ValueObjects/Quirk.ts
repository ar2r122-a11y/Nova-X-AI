
export class Quirk {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(description: string): Quirk {
        if (!description || description.trim().length === 0) {
            throw new Error("Quirk description cannot be empty.");
        }
        return new Quirk(description);
    }

    public static fromString(value: string): Quirk {
        return Quirk.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Quirk): boolean {
        return this.value === other.value;
    }
}
