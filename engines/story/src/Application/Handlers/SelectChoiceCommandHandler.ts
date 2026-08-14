import type { IEventBus } from "@nova-x-ai/core";
import { SelectChoiceCommand } from "../Commands/SelectChoiceCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { SelectChoiceValidator } from "../Validators/SelectChoiceValidator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";
import { BranchId } from "../../Domain/ValueObjects/BranchId";

export class SelectChoiceCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: SelectChoiceCommand): Promise<StoryAggregateDto> {
        SelectChoiceValidator.validate(command);
        if (!StoryAuthorizationPolicy.canSelectChoice("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to select choices.");
        }

        const storyId = StoryId.create(command.storyId);
        const sceneId = SceneId.create(command.sceneId);
        const branchId = BranchId.create(command.branchId);
        const aggregate = await this.storyDomainService.selectChoice(storyId, sceneId, command.choiceId, branchId);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
