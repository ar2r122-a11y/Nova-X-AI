import type { IEventBus } from "@nova-x-ai/core";
import { AdvanceSceneCommand } from "../Commands/AdvanceSceneCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { AdvanceSceneValidator } from "../Validators/AdvanceSceneValidator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";

export class AdvanceSceneCommandHandler {
    constructor(
        _eventBus: IEventBus,
        _storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: AdvanceSceneCommand): Promise<StoryAggregateDto> {
        AdvanceSceneValidator.validate(command);
        if (!StoryAuthorizationPolicy.canAdvanceScene("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to advance scenes.");
        }

        const storyId = StoryId.create(command.storyId);
        const sceneId = SceneId.create(command.sceneId);
        const aggregate = await this.storyDomainService.advanceScene(storyId, sceneId);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
