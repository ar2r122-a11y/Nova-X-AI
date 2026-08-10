import type { EmotionAggregate } from "../Aggregates/EmotionAggregate";
import type { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";

export interface IEmotionDomainService {
    applyStimulus(aggregate: EmotionAggregate, stimulus: EmotionalStimulus, sensitivity: number): void;
    processDecayTick(aggregate: EmotionAggregate, elapsedMs: number): void;
}
