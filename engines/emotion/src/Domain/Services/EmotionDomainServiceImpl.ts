import { IEmotionDomainService } from "./IEmotionDomainService";
import type { EmotionAggregate } from "../Aggregates/EmotionAggregate";
import type { EmotionalStimulus } from "../ValueObjects/EmotionalStimulus";

export class EmotionDomainServiceImpl implements IEmotionDomainService {
    applyStimulus(aggregate: EmotionAggregate, stimulus: EmotionalStimulus, sensitivity: number): void {
        aggregate.applyStimulus(stimulus, sensitivity);
    }

    processDecayTick(aggregate: EmotionAggregate, elapsedMs: number): void {
        aggregate.processDecayTick(elapsedMs);
    }
}
