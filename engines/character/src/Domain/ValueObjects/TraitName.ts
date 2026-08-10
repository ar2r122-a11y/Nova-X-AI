
export class TraitName {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(name: string): TraitName {
        if (!name || name.trim().length === 0) {
            throw new Error("TraitName cannot be empty.");
        }
        return new TraitName(name);
    }

    public static fromString(value: string): TraitName {
        return TraitName.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TraitName): boolean {
        return this.value === other.value;
    }
}
