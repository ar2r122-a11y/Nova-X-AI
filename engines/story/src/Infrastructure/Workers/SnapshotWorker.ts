import type { IEventBus } from "@nova-x-ai/core";
import type { IStorySnapshotManager } from "../../Domain/Services/IStorySnapshotManager";
import { BaseStoryWorker } from "./BaseStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export class SnapshotWorker extends BaseStoryWorker {
    private mutationCount = 0;
    private readonly threshold = 10;

    constructor(
        eventBus: IEventBus,
        _snapshotManager: IStorySnapshotManager
    ) {
        super(eventBus, "SnapshotWorker");
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

    recordMutation(): void {
        this.mutationCount++;
        if (this.mutationCount >= this.threshold) {
            this.mutationCount = 0;
            this.createSnapshot();
        }
    }

    private async createSnapshot(): Promise<void> {
        this.eventBus.publish({
            eventType: "EVT_STORY_SnapshotCreating",
            timestamp: Date.now(),
            correlationId: `snapshot-${Date.now()}`,
            payload: {},
        });
    }
}
