import { StoryId } from "../ValueObjects/StoryId";
import { StoryAggregate } from "../Aggregates/StoryAggregate";

export interface IStoryRepository {
    save(story: StoryAggregate): Promise<void>;
    getById(storyId: StoryId): Promise<StoryAggregate | null>;
    getAll(): Promise<StoryAggregate[]>;
    delete(storyId: StoryId): Promise<void>;
    exists(storyId: StoryId): Promise<boolean>;
}
