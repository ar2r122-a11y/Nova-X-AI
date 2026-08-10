
export class SpeechStyle {
    public readonly dialect: string;
    public readonly tempo: string;
    public readonly vocabularyLevel: number;

    private constructor(dialect: string, tempo: string, vocabularyLevel: number) {
        this.dialect = dialect;
        this.tempo = tempo;
        this.vocabularyLevel = vocabularyLevel;
    }

    public static create(dialect: string, tempo: string, vocabularyLevel: number): SpeechStyle {
        if (!dialect || dialect.trim().length === 0) {
            throw new Error("Dialect cannot be empty.");
        }
        if (!tempo || tempo.trim().length === 0) {
            throw new Error("Tempo cannot be empty.");
        }
        if (vocabularyLevel < 0.0 || vocabularyLevel > 1.0) {
            throw new Error("Vocabulary level must be between 0.0 and 1.0.");
        }
        return new SpeechStyle(dialect, tempo, vocabularyLevel);
    }

    public getValue(): { dialect: string; tempo: string; vocabularyLevel: number } {
        return { dialect: this.dialect, tempo: this.tempo, vocabularyLevel: this.vocabularyLevel };
    }

    public equals(other: SpeechStyle): boolean {
        return this.dialect === other.dialect && this.tempo === other.tempo && this.vocabularyLevel === other.vocabularyLevel;
    }
}
