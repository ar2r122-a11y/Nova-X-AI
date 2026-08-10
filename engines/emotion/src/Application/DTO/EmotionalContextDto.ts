export class EmotionalContextDto {
    constructor(
        public readonly characterId: string,
        public readonly emotionalState: string,
        public readonly primaryEmotion: string,
        public readonly currentMood: string,
        public readonly pleasure: number,
        public readonly arousal: number,
        public readonly dominance: number,
        public readonly stabilityIndex: number,
        public readonly recentHistory: { timestamp: number; emotion: string; mood: string }[],
        public readonly promptContext: string
    ) {}

    static fromAggregate(aggregate: import("../../Domain/Aggregates/EmotionAggregate").EmotionAggregate): EmotionalContextDto {
        const ledgers = aggregate.getLedgers();
        const recentHistory = ledgers.slice(-5).map(l => ({
            timestamp: l.getTimestamp(),
            emotion: l.getNewPrimaryEmotion(),
            mood: l.getNewPrimaryMood()
        }));

        const contextParts: string[] = [];
        contextParts.push(`Current Emotion: ${aggregate.getPrimaryEmotion().getValue()}`);
        contextParts.push(`Mood: ${aggregate.getCurrentMood().getMoodName()}`);
        contextParts.push(`Stability: ${aggregate.getStabilityIndex().toFixed(2)}`);
        contextParts.push(`PAD: pleasure=${aggregate.getPAD().getPleasure().toFixed(2)}, arousal=${aggregate.getPAD().getArousal().toFixed(2)}, dominance=${aggregate.getPAD().getDominance().toFixed(2)}`);
        if (recentHistory.length > 0) {
            contextParts.push(`Recent Emotional Transitions:`);
            recentHistory.forEach(h => {
                contextParts.push(`  ${new Date(h.timestamp).toISOString()}: ${h.emotion} (${h.mood})`);
            });
        }

        return new EmotionalContextDto(
            aggregate.getCharacterId(),
            aggregate.getEmotionalState(),
            aggregate.getPrimaryEmotion().getValue(),
            aggregate.getCurrentMood().getMoodName(),
            aggregate.getPAD().getPleasure(),
            aggregate.getPAD().getArousal(),
            aggregate.getPAD().getDominance(),
            aggregate.getStabilityIndex(),
            recentHistory,
            contextParts.join("\n")
        );
    }
}
