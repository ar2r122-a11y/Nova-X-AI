import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryWorker } from "./IStoryWorker";
import { BaseStoryWorker } from "./BaseStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export class SynchronizationWorker extends BaseStoryWorker {
    constructor(eventBus: IEventBus) {
        super(eventBus, "SynchronizationWorker");
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
