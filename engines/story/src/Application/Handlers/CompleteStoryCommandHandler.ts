import type { IEventBus } from "@nova-x-ai/core";
import { CompleteStoryCommand } from "../Commands/CompleteStoryCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { CompleteStoryValidator } from "../Validators/CompleteStoryValidator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { EndingId } from "../../Domain/ValueObjects/EndingId";

export class CompleteStoryCommandHandler {
    constructor(
        _eventBus: IEventBus,
        _storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: CompleteStoryCommand): Promise<StoryAggregateDto> {
        CompleteStoryValidator.validate(command);
        if (!StoryAuthorizationPolicy.canCompleteStory("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to complete stories.");
        }

        const storyId = StoryId.create(command.storyId);
        const endingId = EndingId.create(command.endingId);
        const aggregate = await this.storyDomainService.completeStory(storyId, endingId);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
