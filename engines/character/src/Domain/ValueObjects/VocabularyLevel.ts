
export class VocabularyLevel {
    public readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(level: number): VocabularyLevel {
        if (level < 0.0 || level > 1.0) {
            throw new Error("VocabularyLevel must be between 0.0 and 1.0.");
        }
        return new VocabularyLevel(level);
    }

    public static fromNumber(value: number): VocabularyLevel {
        return VocabularyLevel.create(value);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: VocabularyLevel): boolean {
        return this.value === other.value;
    }
}
