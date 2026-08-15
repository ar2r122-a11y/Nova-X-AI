import { StoryAggregate } from "../Aggregates/StoryAggregate";

export class StoryIsActiveSpecification {
    static isSatisfiedBy(story: StoryAggregate): boolean {
        return story.getStatus().getValue() === "active";
    }
}
