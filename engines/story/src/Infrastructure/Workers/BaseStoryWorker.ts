import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryWorker } from "./IStoryWorker";
import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export abstract class BaseStoryWorker implements IStoryWorker {
    protected state: WorkerHealthState = WorkerHealthState.Stopped;
    private running = false;

    constructor(protected readonly eventBus: IEventBus, protected readonly workerName: string) {}

    abstract start(): Promise<void>;
    abstract pause(): Promise<void>;
    abstract resume(): Promise<void>;
    abstract stop(): Promise<void>;

    getWorkerName(): string {
        return this.workerName;
    }

    getHealthState(): WorkerHealthState {
        return this.state;
    }

    isRunning(): boolean {
        return this.running;
    }

    protected setState(newState: WorkerHealthState): void {
        this.state = newState;
        this.running = newState === WorkerHealthState.Running;

        this.eventBus.publish({
            eventType: "EVT_STORY_WorkerHealthChanged",
            timestamp: Date.now(),
            correlationId: `worker-${this.workerName}-${Date.now()}`,
            payload: {
                workerName: this.workerName,
                state: newState,
            },
        });
    }
}
