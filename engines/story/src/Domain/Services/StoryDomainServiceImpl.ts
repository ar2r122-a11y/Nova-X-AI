import type { IEventBus } from "@nova-x-ai/core";
import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { StoryId } from "../ValueObjects/StoryId";
import { SceneId } from "../ValueObjects/SceneId";
import { BranchId } from "../ValueObjects/BranchId";
import { EndingId } from "../ValueObjects/EndingId";
import { IStoryRepository } from "../Repositories/IStoryRepository";
import { IQuestRepository } from "../Repositories/IQuestRepository";
import { IEndingRegistryRepository } from "../Repositories/IEndingRegistryRepository";
import { IStoryEventStoreRepository } from "../Repositories/IStoryEventStoreRepository";
import { IStoryDomainService } from "./IStoryDomainService";

export class StoryDomainServiceImpl implements IStoryDomainService {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository,
        _questRepository: IQuestRepository,
        _endingRegistryRepository: IEndingRegistryRepository,
        private readonly eventStoreRepository: IStoryEventStoreRepository
    ) {}

    async startStory(storyId: StoryId, title: string, description: string): Promise<StoryAggregate> {
        const aggregate = StoryAggregate.create(storyId, title, description);
        await this.storyRepository.save(aggregate);
        await this.publishEvents(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    async advanceScene(storyId: StoryId, sceneId: SceneId): Promise<StoryAggregate> {
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId.getValue()}`);
        }

        aggregate.advanceScene(sceneId);
        await this.storyRepository.save(aggregate);
        await this.publishEvents(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    async selectChoice(storyId: StoryId, sceneId: SceneId, choiceId: string, branchId: BranchId): Promise<StoryAggregate> {
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId.getValue()}`);
        }

        aggregate.selectChoice(sceneId, choiceId, branchId);
        await this.storyRepository.save(aggregate);
        await this.publishEvents(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    async completeStory(storyId: StoryId, endingId: EndingId): Promise<StoryAggregate> {
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId.getValue()}`);
        }

        aggregate.completeStory(endingId);
        await this.storyRepository.save(aggregate);
        await this.publishEvents(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    async failStory(storyId: StoryId, reason: string): Promise<StoryAggregate> {
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId.getValue()}`);
        }

        aggregate.failStory(reason);
        await this.storyRepository.save(aggregate);
        await this.publishEvents(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    private async publishEvents(aggregate: StoryAggregate): Promise<void> {
        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
            const payload = event as unknown as {
                eventType: string;
                correlationId: string;
                causationId?: string | null;
                metadata?: Record<string, unknown>;
            };
            await this.eventStoreRepository.append(
                aggregate.getStoryId().getValue(),
                payload.eventType,
                payload as Record<string, unknown>,
                {
                    correlationId: payload.correlationId,
                    causationId: payload.causationId ?? null,
                    metadata: payload.metadata ?? {},
                }
            );
        }
    }
}
