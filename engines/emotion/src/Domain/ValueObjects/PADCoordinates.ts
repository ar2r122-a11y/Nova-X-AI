export class PADCoordinates {
    private static readonly PLEASURE_MIN = -1.0;
    private static readonly PLEASURE_MAX = 1.0;
    private static readonly AROUSAL_MIN = 0.0;
    private static readonly AROUSAL_MAX = 1.0;
    private static readonly DOMINANCE_MIN = -1.0;
    private static readonly DOMINANCE_MAX = 1.0;

    private constructor(
        public readonly pleasure: number,
        public readonly arousal: number,
        public readonly dominance: number
    ) {}

    static create(pleasure: number, arousal: number, dominance: number): PADCoordinates {
        const clampedPleasure = Math.max(PADCoordinates.PLEASURE_MIN, Math.min(PADCoordinates.PLEASURE_MAX, pleasure));
        const clampedArousal = Math.max(PADCoordinates.AROUSAL_MIN, Math.min(PADCoordinates.AROUSAL_MAX, arousal));
        const clampedDominance = Math.max(PADCoordinates.DOMINANCE_MIN, Math.min(PADCoordinates.DOMINANCE_MAX, dominance));
        return new PADCoordinates(clampedPleasure, clampedArousal, clampedDominance);
    }

    static baseline(): PADCoordinates {
        return new PADCoordinates(0.0, 0.2, 0.5);
    }

    static neutral(): PADCoordinates {
        return new PADCoordinates(0.0, 0.0, 0.0);
    }

    getPleasure(): number {
        return this.pleasure;
    }

    getArousal(): number {
        return this.arousal;
    }

    getDominance(): number {
        return this.dominance;
    }

    add(delta: import("./EmotionalDelta").EmotionalDelta): PADCoordinates {
        return PADCoordinates.create(
            this.pleasure + delta.pleasure,
            this.arousal + delta.arousal,
            this.dominance + delta.dominance
        );
    }

    interpolateToward(target: PADCoordinates, rate: number): PADCoordinates {
        const fraction = Math.max(0.0, Math.min(1.0, rate));
        return PADCoordinates.create(
            this.pleasure + (target.pleasure - this.pleasure) * fraction,
            this.arousal + (target.arousal - this.arousal) * fraction,
            this.dominance + (target.dominance - this.dominance) * fraction
        );
    }

    distanceFrom(target: PADCoordinates): number {
        const dp = this.pleasure - target.pleasure;
        const da = this.arousal - target.arousal;
        const dd = this.dominance - target.dominance;
        return Math.sqrt(dp * dp + da * da + dd * dd);
    }

    equals(other: PADCoordinates): boolean {
        return (
            this.pleasure === other.pleasure &&
            this.arousal === other.arousal &&
            this.dominance === other.dominance
        );
    }

    toJSON(): { pleasure: number; arousal: number; dominance: number } {
        return {
            pleasure: this.pleasure,
            arousal: this.arousal,
            dominance: this.dominance
        };
    }
}
