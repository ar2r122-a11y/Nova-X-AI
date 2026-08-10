
export class Fear {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(description: string): Fear {
        if (!description || description.trim().length === 0) {
            throw new Error("Fear description cannot be empty.");
        }
        return new Fear(description);
    }

    public static fromString(value: string): Fear {
        return Fear.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Fear): boolean {
        return this.value === other.value;
    }
}
