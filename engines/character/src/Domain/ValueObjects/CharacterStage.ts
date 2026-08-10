
export class CharacterStage {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static readonly Initial = new CharacterStage("initial");
    public static readonly Developing = new CharacterStage("developing");
    public static readonly Mature = new CharacterStage("mature");
    public static readonly Evolved = new CharacterStage("evolved");

    public static create(value: string): CharacterStage {
        const validValues = ["initial", "developing", "mature", "evolved"];
        if (!validValues.includes(value)) {
            throw new Error(`Invalid CharacterStage: ${value}`);
        }
        return new CharacterStage(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CharacterStage): boolean {
        return this.value === other.value;
    }
}
