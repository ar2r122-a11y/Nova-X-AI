import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { SceneId } from "../ValueObjects/SceneId";
import { Branch } from "../Entities/Branch";
import { BranchConditionIsSatisfiedSpecification } from "../Specifications/BranchConditionIsSatisfiedSpecification";
import { IBranchingService } from "./IBranchingService";

export class BranchingService implements IBranchingService {
    resolveBranch(story: StoryAggregate, sceneId: SceneId, context: Record<string, unknown>): Branch | null {
        const branches = story.getBranches().filter((b) => b.getSourceSceneId().equals(sceneId) && b.isActive());
        const satisfied = branches.filter((b) => this.validateBranchCondition(b, context));

        if (satisfied.length === 0) {
            return null;
        }

        satisfied.sort((a, b) => {
            const order = { critical: 0, high: 1, normal: 2, low: 3 };
            return order[a.getPriority().getValue()] - order[b.getPriority().getValue()];
        });

        return satisfied[0];
    }

    validateBranchCondition(branch: Branch, context: Record<string, unknown>): boolean {
        return BranchConditionIsSatisfiedSpecification.isSatisfiedBy(branch, context);
    }

    getAvailableBranches(story: StoryAggregate, sceneId: SceneId, context: Record<string, unknown>): Branch[] {
        const branches = story.getBranches().filter((b) => b.getSourceSceneId().equals(sceneId) && b.isActive());
        return branches.filter((b) => this.validateBranchCondition(b, context));
    }
}
