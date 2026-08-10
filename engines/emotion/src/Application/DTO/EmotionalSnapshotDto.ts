export class EmotionalSnapshotDto {
    constructor(
        public readonly characterId: string,
        public readonly currentStateId: string,
        public readonly primaryEmotion: string,
        public readonly intensity: number,
        public readonly pleasure: number,
        public readonly arousal: number,
        public readonly dominance: number,
        public readonly currentMood: string,
        public readonly moodStability: number,
        public readonly moodDuration: number,
        public readonly stabilityIndex: number,
        public readonly emotionalState: string,
        public readonly lastUpdated: number
    ) {}

    static fromAggregate(aggregate: import("../../Domain/Aggregates/EmotionAggregate").EmotionAggregate): EmotionalSnapshotDto {
        return new EmotionalSnapshotDto(
            aggregate.getCharacterId(),
            aggregate.getCurrentStateId(),
            aggregate.getPrimaryEmotion().getValue(),
            aggregate.getIntensity(),
            aggregate.getPAD().getPleasure(),
            aggregate.getPAD().getArousal(),
            aggregate.getPAD().getDominance(),
            aggregate.getCurrentMood().getMoodName(),
            aggregate.getMoodStability(),
            aggregate.getMoodDuration(),
            aggregate.getStabilityIndex(),
            aggregate.getEmotionalState(),
            aggregate.getLastUpdated()
        );
    }
}
