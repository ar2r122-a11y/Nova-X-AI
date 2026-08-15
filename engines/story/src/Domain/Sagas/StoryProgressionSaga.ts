import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryRepository } from "../Repositories/IStoryRepository";
import type { IStoryProgressionSaga } from "./IStoryProgressionSaga";

export class StoryProgressionSaga implements IStoryProgressionSaga {
    private state = "NotStarted";
    private processedEvents = new Set<string>();

    constructor(
        private readonly eventBus: IEventBus,
        _storyRepository: IStoryRepository
    ) {}

    async initialize(storyId: string): Promise<void> {
        this.state = "Running";

        await this.eventBus.publish({
            eventType: "EVT_STORY_SagaInitialized",
            timestamp: Date.now(),
            correlationId: `saga-${storyId}-${Date.now()}`,
            payload: { storyId },
        });
    }

    async handleEvent(event: { eventType: string; correlationId: string; payload: Record<string, unknown> }): Promise<void> {
        if (this.processedEvents.has(event.correlationId)) {
            return;
        }

        this.processedEvents.add(event.correlationId);

        await this.eventBus.publish({
            eventType: "EVT_STORY_SagaEventHandled",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                eventType: event.eventType,
                storyId: event.payload.storyId,
            },
        });
    }

    async compensate(storyId: string, targetVersion: number): Promise<void> {
        this.state = "Compensating";

        await this.eventBus.publish({
            eventType: "EVT_STORY_SagaCompensating",
            timestamp: Date.now(),
            correlationId: `saga-compensate-${storyId}-${Date.now()}`,
            payload: { storyId, targetVersion },
        });

        this.state = "Running";
    }

    getState(): string {
        return this.state;
    }
}
