import { WorldClockAggregate } from "../Aggregates/WorldClockAggregate";

export class IsClockAdvanceableSpecification {
    static isSatisfiedBy(aggregate: WorldClockAggregate): boolean {
        return aggregate.getTickCount() >= 0;
    }
}
