import type { IEventBus } from "@nova-x-ai/core";
import type { IBranchingService } from "../../Domain/Services/IBranchingService";
import type { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";
import { SceneId } from "../../Domain/ValueObjects/SceneId";

export interface IDeterministicFallback {
    selectBranch(
        aggregate: StoryAggregate,
        sceneId: string,
        context: Record<string, unknown>
    ): Promise<{ choiceId: string; branchId: string } | null>;
}

export class DeterministicFallback implements IDeterministicFallback {
    constructor(
        private readonly branchingService: IBranchingService,
        private readonly eventBus: IEventBus
    ) {}

    async selectBranch(
        aggregate: StoryAggregate,
        sceneId: string,
        context: Record<string, unknown>
    ): Promise<{ choiceId: string; branchId: string } | null> {
        const sceneIdVo = SceneId.create(sceneId);
        const branch = this.branchingService.resolveBranch(aggregate, sceneIdVo, context);

        if (!branch) {
            await this.eventBus.publish({
                eventType: "EVT_STORY_DeterministicFallbackNoBranch",
                timestamp: Date.now(),
                correlationId: "",
                payload: {
                    storyId: aggregate.getStoryId().getValue(),
                    sceneId,
                    context,
                },
            });
            return null;
        }

        const choices = aggregate.getScenes().find((s) => s.getSceneId().equals(sceneIdVo))?.getChoices();
        const matchingChoice = choices?.find((c) => c.branchId === branch.getBranchId().getValue());

        if (!matchingChoice) {
            await this.eventBus.publish({
                eventType: "EVT_STORY_DeterministicFallbackNoChoice",
                timestamp: Date.now(),
                correlationId: "",
                payload: {
                    storyId: aggregate.getStoryId().getValue(),
                    sceneId,
                    branchId: branch.getBranchId().getValue(),
                },
            });
            return null;
        }

        return {
            choiceId: matchingChoice.choiceId,
            branchId: branch.getBranchId().getValue(),
        };
    }
}
