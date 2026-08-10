import { EmotionAggregate } from "../Aggregates/EmotionAggregate";

export class IsEmotionallyStableSpecification {
    static isSatisfiedBy(aggregate: EmotionAggregate): boolean {
        return aggregate.getStabilityIndex() > 0.5;
    }
}
