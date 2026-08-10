export class EmotionalHistoryDto {
    constructor(
        public readonly characterId: string,
        public readonly entries: {
            ledgerId: string;
            timestamp: number;
            previousPrimaryEmotion: string;
            newPrimaryEmotion: string;
            previousPrimaryMood: string;
            newPrimaryMood: string;
            previousPAD: { pleasure: number; arousal: number; dominance: number };
            newPAD: { pleasure: number; arousal: number; dominance: number };
            previousIntensity: number;
            newIntensity: number;
            previousStabilityIndex: number;
            newStabilityIndex: number;
            stimulusType?: string;
            stimulusIntensity?: number;
            stimulusValence?: number;
        }[]
    ) {}

    static fromAggregate(aggregate: import("../../Domain/Aggregates/EmotionAggregate").EmotionAggregate): EmotionalHistoryDto {
        const entries = aggregate.getLedgers().map(l => ({
            ledgerId: l.getLedgerId(),
            timestamp: l.getTimestamp(),
            previousPrimaryEmotion: l.getPreviousPrimaryEmotion(),
            newPrimaryEmotion: l.getNewPrimaryEmotion(),
            previousPrimaryMood: l.getPreviousPrimaryMood(),
            newPrimaryMood: l.getNewPrimaryMood(),
            previousPAD: l.getPreviousPAD(),
            newPAD: l.getNewPAD(),
            previousIntensity: l.getPreviousIntensity(),
            newIntensity: l.getNewIntensity(),
            previousStabilityIndex: l.getPreviousStabilityIndex(),
            newStabilityIndex: l.getNewStabilityIndex(),
            stimulusType: l.getStimulusType(),
            stimulusIntensity: l.getStimulusIntensity(),
            stimulusValence: l.getStimulusValence()
        }));
        return new EmotionalHistoryDto(aggregate.getCharacterId(), entries);
    }
}
