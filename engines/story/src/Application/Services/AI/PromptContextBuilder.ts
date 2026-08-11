import { StoryAggregate } from "../../../Domain/Aggregates/StoryAggregate";
import type { IStoryEventStoreRepository } from "../../../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryRepository } from "../../../Domain/Repositories/IStoryRepository";
import { PromptContextDto } from "../../../DTO/AI/PromptContextDto";

export interface IPromptContextBuilder {
    build(aggregate: StoryAggregate): Promise<PromptContextDto>;
}

export class PromptContextBuilder implements IPromptContextBuilder {
    constructor(
        private readonly eventStoreRepository: IStoryEventStoreRepository,
        private readonly storyRepository: IStoryRepository
    ) {}

    async build(aggregate: StoryAggregate): Promise<PromptContextDto> {
        const context = PromptContextDto.fromAggregate(aggregate);

        const storyId = aggregate.getStoryId().getValue();
        const events = await this.eventStoreRepository.getStreamEvents(storyId);
        const recentEvents = events.slice(-10).map((e) => ({
            eventType: e.eventType,
            timestamp: e.timestamp,
            payload: e.payload,
            version: e.version,
        }));

        context.withRecentNarrativeLedgerEntries(recentEvents);

        return context;
    }
}
