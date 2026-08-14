import type { IEventBus } from "@nova-x-ai/core";
import { StartStoryCommand } from "../Commands/StartStoryCommand";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { StoryAuthorizationPolicy } from "../../Domain/Policies/StoryAuthorizationPolicy";
import { StartStoryValidator } from "../Validators/StartStoryValidator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class StartStoryCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository,
        private readonly storyDomainService: IStoryDomainService
    ) {}

    async handle(command: StartStoryCommand): Promise<StoryAggregateDto> {
        StartStoryValidator.validate(command);
        if (!StoryAuthorizationPolicy.canStartStory("", command.claims)) {
            throw new Error("Unauthorized: user is not authorized to start stories.");
        }

        const storyId = StoryId.create(command.storyId);
        const aggregate = await this.storyDomainService.startStory(storyId, command.title, command.description);
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
