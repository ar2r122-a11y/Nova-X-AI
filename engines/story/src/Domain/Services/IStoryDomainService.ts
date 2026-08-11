import { StoryId } from "../ValueObjects/StoryId";
import { SceneId } from "../ValueObjects/SceneId";
import { BranchId } from "../ValueObjects/BranchId";
import { EndingId } from "../ValueObjects/EndingId";
import { StoryAggregate } from "../Aggregates/StoryAggregate";

export interface IStoryDomainService {
    startStory(storyId: StoryId, title: string, description: string): Promise<StoryAggregate>;
    advanceScene(storyId: StoryId, sceneId: SceneId): Promise<StoryAggregate>;
    selectChoice(storyId: StoryId, sceneId: SceneId, choiceId: string, branchId: BranchId): Promise<StoryAggregate>;
    completeStory(storyId: StoryId, endingId: EndingId): Promise<StoryAggregate>;
    failStory(storyId: StoryId, reason: string): Promise<StoryAggregate>;
}
