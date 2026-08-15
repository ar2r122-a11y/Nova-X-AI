import type { IEventBus } from "@nova-x-ai/core";
import { FailStoryCommand } from "../Commands/FailStoryCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { FailStoryValidator } from "../Validators/FailStoryValidator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class FailStoryCommandHandler {
    constructor(
        _eventBus: IEventBus,
        _storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: FailStoryCommand): Promise<StoryAggregateDto> {
        FailStoryValidator.validate(command);
        if (!StoryAuthorizationPolicy.canFailStory("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to fail stories.");
        }

        const storyId = StoryId.create(command.storyId);
        const aggregate = await this.storyDomainService.failStory(storyId, command.reason);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
