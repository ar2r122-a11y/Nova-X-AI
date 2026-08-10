
export class PersonalityTrait {
    public readonly name: string;
    public readonly score: number;

    private constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }

    public static create(name: string, score: number): PersonalityTrait {
        if (!name || name.trim().length === 0) {
            throw new Error("Trait name cannot be empty.");
        }
        if (score < 0.0 || score > 1.0) {
            throw new Error("Trait score must be between 0.0 and 1.0.");
        }
        return new PersonalityTrait(name, score);
    }

    public static fromObject(data: { name: string; score: number }): PersonalityTrait {
        return PersonalityTrait.create(data.name, data.score);
    }

    public getValue(): { name: string; score: number } {
        return { name: this.name, score: this.score };
    }

    public equals(other: PersonalityTrait): boolean {
        return this.name === other.name && this.score === other.score;
    }
}
