export const PRIMARY_EMOTIONS = [
    "joy",
    "anger",
    "sadness",
    "fear",
    "surprise",
    "disgust",
    "neutral"
] as const;

export type PrimaryEmotionType = (typeof PRIMARY_EMOTIONS)[number];

export class PrimaryEmotion {
    private constructor(public readonly value: PrimaryEmotionType) {}

    static joy(): PrimaryEmotion {
        return new PrimaryEmotion("joy");
    }

    static anger(): PrimaryEmotion {
        return new PrimaryEmotion("anger");
    }

    static sadness(): PrimaryEmotion {
        return new PrimaryEmotion("sadness");
    }

    static fear(): PrimaryEmotion {
        return new PrimaryEmotion("fear");
    }

    static surprise(): PrimaryEmotion {
        return new PrimaryEmotion("surprise");
    }

    static disgust(): PrimaryEmotion {
        return new PrimaryEmotion("disgust");
    }

    static neutral(): PrimaryEmotion {
        return new PrimaryEmotion("neutral");
    }

    static create(value: string): PrimaryEmotion {
        const lower = value.toLowerCase();
        if (!PRIMARY_EMOTIONS.includes(lower as PrimaryEmotionType)) {
            return PrimaryEmotion.neutral();
        }
        return new PrimaryEmotion(lower as PrimaryEmotionType);
    }

    static fromPAD(pleasure: number, arousal: number, dominance: number): PrimaryEmotion {
        if (pleasure > 0.3) {
            if (arousal > 0.5) {
                return PrimaryEmotion.joy();
            }
            return PrimaryEmotion.neutral();
        }

        if (pleasure < -0.3) {
            if (pleasure < -0.5 && arousal < 0.3) {
                return PrimaryEmotion.disgust();
            }
            if (arousal > 0.5) {
                if (dominance < 0) {
                    return PrimaryEmotion.anger();
                }
                return PrimaryEmotion.fear();
            }
            if (arousal > 0.3) {
                return PrimaryEmotion.anger();
            }
            return PrimaryEmotion.sadness();
        }

        if (arousal > 0.6) {
            return PrimaryEmotion.surprise();
        }

        return PrimaryEmotion.neutral();
    }

    getValue(): PrimaryEmotionType {
        return this.value;
    }

    toString(): string {
        return this.value;
    }

    equals(other: PrimaryEmotion): boolean {
        return this.value === other.value;
    }
}
