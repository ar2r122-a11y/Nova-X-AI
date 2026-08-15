import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { BaseStoryWorker } from "./BaseStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export class ReplayWorker extends BaseStoryWorker {
    constructor(
        eventBus: IEventBus,
        private readonly eventStoreRepository: IStoryEventStoreRepository,
        _storyRepository: IStoryRepository
    ) {
        super(eventBus, "ReplayWorker");
    }

    async start(): Promise<void> {
        this.setState(WorkerHealthState.Initializing);
        this.setState(WorkerHealthState.Running);
    }

    async pause(): Promise<void> {
        this.setState(WorkerHealthState.Paused);
    }

    async resume(): Promise<void> {
        this.setState(WorkerHealthState.Running);
    }

    async stop(): Promise<void> {
        this.setState(WorkerHealthState.Terminated);
    }

    async replayStream(streamId: string): Promise<void> {
        const events = await this.eventStoreRepository.getStreamEvents(streamId);
        for (const event of events) {
            this.eventBus.publish({
                eventType: "EVT_STORY_EventReplayed",
                timestamp: Date.now(),
                correlationId: `replay-${streamId}-${Date.now()}`,
                payload: event,
            });
        }
    }
}
