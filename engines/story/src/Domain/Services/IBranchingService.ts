import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { SceneId } from "../ValueObjects/SceneId";
import { Branch } from "../Entities/Branch";

export interface IBranchingService {
    resolveBranch(story: StoryAggregate, sceneId: SceneId, context: Record<string, unknown>): Branch | null;
    validateBranchCondition(branch: Branch, context: Record<string, unknown>): boolean;
    getAvailableBranches(story: StoryAggregate, sceneId: SceneId, context: Record<string, unknown>): Branch[];
}
