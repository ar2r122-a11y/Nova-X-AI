export type MoodName =
    | "cheerful"
    | "content"
    | "serene"
    | "alert"
    | "gloomy"
    | "irritable"
    | "agitated"
    | "overwhelmed"
    | "neutral";

export class MoodDescriptor {
    private constructor(
        public readonly moodName: MoodName,
        public readonly stabilityWeight: number
    ) {}

    static create(moodName: MoodName, stabilityWeight: number): MoodDescriptor {
        const clampedStability = Math.max(0.0, Math.min(1.0, stabilityWeight));
        return new MoodDescriptor(moodName, clampedStability);
    }

    static neutral(): MoodDescriptor {
        return new MoodDescriptor("neutral", 1.0);
    }

    static cheerful(): MoodDescriptor {
        return new MoodDescriptor("cheerful", 0.7);
    }

    static gloomy(): MoodDescriptor {
        return new MoodDescriptor("gloomy", 0.6);
    }

    static irritable(): MoodDescriptor {
        return new MoodDescriptor("irritable", 0.4);
    }

    static serene(): MoodDescriptor {
        return new MoodDescriptor("serene", 0.8);
    }

    static fromPAD(pleasure: number, arousal: number): MoodDescriptor {
        if (pleasure > 0.3 && arousal > 0.5) {
            return MoodDescriptor.cheerful();
        }
        if (pleasure > 0.3 && arousal <= 0.5) {
            return MoodDescriptor.content();
        }
        if (pleasure < -0.3 && arousal > 0.6) {
            return MoodDescriptor.agitated();
        }
        if (pleasure < -0.3 && arousal > 0.4) {
            return MoodDescriptor.irritable();
        }
        if (pleasure < -0.3 && arousal <= 0.4) {
            return MoodDescriptor.gloomy();
        }
        if (Math.abs(pleasure) <= 0.3 && arousal <= 0.3) {
            return MoodDescriptor.serene();
        }
        if (Math.abs(pleasure) <= 0.3 && arousal > 0.5) {
            return MoodDescriptor.alert();
        }
        return MoodDescriptor.neutral();
    }

    static content(): MoodDescriptor {
        return new MoodDescriptor("content", 0.7);
    }

    static alert(): MoodDescriptor {
        return new MoodDescriptor("alert", 0.5);
    }

    static agitated(): MoodDescriptor {
        return new MoodDescriptor("agitated", 0.3);
    }

    static overwhelmed(): MoodDescriptor {
        return new MoodDescriptor("overwhelmed", 0.2);
    }

    getMoodName(): MoodName {
        return this.moodName;
    }

    getStabilityWeight(): number {
        return this.stabilityWeight;
    }

    equals(other: MoodDescriptor): boolean {
        return this.moodName === other.moodName && this.stabilityWeight === other.stabilityWeight;
    }

    toString(): string {
        return this.moodName;
    }
}
