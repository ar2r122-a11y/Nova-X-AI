import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryDomainService } from "../../Domain/Services/IStoryDomainService";
import { BaseStoryWorker } from "./BaseStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export class StoryWorker extends BaseStoryWorker {
    constructor(
        eventBus: IEventBus,
        _storyDomainService: IStoryDomainService
    ) {
        super(eventBus, "StoryWorker");
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
}
