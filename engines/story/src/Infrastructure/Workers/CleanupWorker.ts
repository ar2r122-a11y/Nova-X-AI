import type { IEventBus } from "@nova-x-ai/core";
import { BaseStoryWorker } from "./BaseStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export class CleanupWorker extends BaseStoryWorker {
    constructor(eventBus: IEventBus) {
        super(eventBus, "CleanupWorker");
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
