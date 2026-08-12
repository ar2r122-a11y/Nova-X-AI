
export class StyleIdentifier {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): StyleIdentifier {
        if (!value || value.trim().length === 0) {
            throw new Error("StyleIdentifier cannot be empty.");
        }
        return new StyleIdentifier(value);
    }

    public static fromString(value: string): StyleIdentifier {
        return StyleIdentifier.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: StyleIdentifier): boolean {
        return this.value === other.value;
    }
}
