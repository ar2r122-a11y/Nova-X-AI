
export class MoralAlignment {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(alignment: string): MoralAlignment {
        if (!alignment || alignment.trim().length === 0) {
            throw new Error("MoralAlignment cannot be empty.");
        }
        return new MoralAlignment(alignment);
    }

    public static fromString(value: string): MoralAlignment {
        return MoralAlignment.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: MoralAlignment): boolean {
        return this.value === other.value;
    }
}
