import { EmotionAggregate, type EmotionalLifecycleState } from "../Aggregates/EmotionAggregate";

export class EmotionAggregateFactory {
    static create(characterId: string): EmotionAggregate {
        return EmotionAggregate.create(characterId);
    }

    static reconstitute(snapshot: {
        characterId: string;
        currentStateId: string;
        pad: { pleasure: number; arousal: number; dominance: number };
        primaryEmotion: string;
        intensity: number;
        lastUpdated: number;
        currentMood: { moodName: string; stabilityWeight: number };
        moodStability: number;
        moodDuration: number;
        activeFeelings: string[];
        sensoryResonance: number;
        resonantMemoryIds: string[];
        traumaTriggers: string[];
        triggers: { triggerId: string; triggerType: string; pattern: string; pleasureDelta: number; arousalDelta: number; dominanceDelta: number; weight: number }[];
        expressionStyle: { expressionStyle: string; verbalToneAdjustment: string; physicalDemeanor: string; intensityMultiplier: number };
        decayRate: number;
        halfLifeMs: number;
        resilienceFactor: number;
        emotionalMaturity: number;
        recoveryProtocol: string;
        stabilityIndex: number;
        activationThreshold: number;
        breakpointThreshold: number;
        totalStimuliProcessed: number;
        peakArousalRecorded: number;
        ledgers: { ledgerId: string; timestamp: number; previousPrimaryEmotion: string; newPrimaryEmotion: string; previousPrimaryMood: string; newPrimaryMood: string; previousPAD: { pleasure: number; arousal: number; dominance: number }; newPAD: { pleasure: number; arousal: number; dominance: number }; previousIntensity: number; newIntensity: number; previousStabilityIndex: number; newStabilityIndex: number; stimulusType?: string; stimulusIntensity?: number; stimulusValence?: number }[];
        emotionalState: EmotionalLifecycleState;
    }): EmotionAggregate {
        return EmotionAggregate.reconstitute(snapshot);
    }
}
