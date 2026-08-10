export class EmotionalDelta {
    private constructor(
        public readonly pleasure: number,
        public readonly arousal: number,
        public readonly dominance: number
    ) {}

    static create(pleasure: number, arousal: number, dominance: number): EmotionalDelta {
        return new EmotionalDelta(pleasure, arousal, dominance);
    }

    static zero(): EmotionalDelta {
        return new EmotionalDelta(0.0, 0.0, 0.0);
    }

    scale(factor: number): EmotionalDelta {
        return new EmotionalDelta(
            this.pleasure * factor,
            this.arousal * factor,
            this.dominance * factor
        );
    }

    add(other: EmotionalDelta): EmotionalDelta {
        return new EmotionalDelta(
            this.pleasure + other.pleasure,
            this.arousal + other.arousal,
            this.dominance + other.dominance
        );
    }

    getMagnitude(): number {
        return Math.sqrt(this.pleasure ** 2 + this.arousal ** 2 + this.dominance ** 2);
    }

    toJSON(): { pleasure: number; arousal: number; dominance: number } {
        return {
            pleasure: this.pleasure,
            arousal: this.arousal,
            dominance: this.dominance
        };
    }
}
