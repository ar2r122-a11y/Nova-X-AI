import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { StoryStatus } from "../ValueObjects/StoryStatus";

export class StoryIsActiveSpecification {
    static isSatisfiedBy(story: StoryAggregate): boolean {
        return story.getStatus().getValue() === "active";
    }
}
