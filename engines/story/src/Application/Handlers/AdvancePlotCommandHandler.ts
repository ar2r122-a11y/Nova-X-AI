import type { IEventBus } from "@nova-x-ai/core";
import { AdvancePlotCommand } from "../Commands/AdvancePlotCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";

export class AdvancePlotCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: AdvancePlotCommand): Promise<StoryAggregateDto> {
        if (!StoryAuthorizationPolicy.canAdvanceScene("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to advance plot.");
        }

        const storyId = StoryId.create(command.storyId);
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            throw new Error(`Story not found: ${command.storyId}`);
        }

        const currentSceneId = aggregate.getProgress().getCurrentSceneId();
        if (!currentSceneId) {
            const firstScene = Array.from(aggregate.getScenes()).sort((a, b) => a.getOrder() - b.getOrder())[0];
            if (!firstScene) {
                throw new Error("No scenes available to advance plot.");
            }
            return this.advanceToScene(storyId, firstScene.getId());
        }

        const nextScene = aggregate.getNextScene(SceneId.create(currentSceneId));
        if (!nextScene) {
            throw new Error("No next scene available to advance plot.");
        }

        return this.advanceToScene(storyId, nextScene.getId());
    }

    private async advanceToScene(storyId: StoryId, sceneId: SceneId): Promise<StoryAggregateDto> {
        const aggregate = await this.storyDomainService.advanceScene(storyId, sceneId);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
