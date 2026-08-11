import { StoryAggregate } from "../Aggregates/StoryAggregate";

export class StoryIsCompletableSpecification {
    static isSatisfiedBy(story: StoryAggregate): boolean {
        return story.getEndings().some((ending) => ending.isUnlocked());
    }
}
