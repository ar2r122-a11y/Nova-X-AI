import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import type { IBranchingService } from "../../Domain/Services/IBranchingService";
import type { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import type { ISceneExecutionPipeline } from "./ISceneExecutionPipeline";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";

export class SceneExecutionPipeline implements ISceneExecutionPipeline {
    constructor(
        private readonly storyRepository: IStoryRepository,
        _eventStoreRepository: IStoryEventStoreRepository,
        private readonly branchingService: IBranchingService,
        private readonly storyDomainService: IStoryDomainService,
        private readonly eventBus: IEventBus
    ) {}

    async execute(storyId: string, sceneId: string, context: { correlationId: string; causationId?: string | null }): Promise<void> {
        const id = StoryId.create(storyId);
        const sceneIdVo = SceneId.create(sceneId);

        const aggregate = await this.storyRepository.getById(id);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId}`);
        }

        const branches = this.branchingService.getAvailableBranches(aggregate, sceneIdVo, {});
        const selectedBranch = branches.length > 0 ? branches[0] : null;

        await this.storyDomainService.advanceScene(id, sceneIdVo);

        await this.eventBus.publish({
            eventType: "EVT_STORY_SceneExecuted",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            causationId: context.causationId ?? null,
            payload: {
                storyId,
                sceneId,
                branchId: selectedBranch?.getBranchId().getValue(),
            },
        });
    }
}
