import type { IStoryWorker } from "./IStoryWorker";
import type { IWorkerLifecycleManager } from "./IWorkerLifecycleManager";

export class WorkerLifecycleManager implements IWorkerLifecycleManager {
    private readonly workers = new Map<string, IStoryWorker>();

    registerWorker(worker: IStoryWorker): void {
        this.workers.set(worker.getWorkerName(), worker);
    }

    async startAll(): Promise<void> {
        for (const worker of this.workers.values()) {
            if (!worker.isRunning()) {
                await worker.start();
            }
        }
    }

    async pauseAll(): Promise<void> {
        for (const worker of this.workers.values()) {
            if (worker.isRunning()) {
                await worker.pause();
            }
        }
    }

    async resumeAll(): Promise<void> {
        for (const worker of this.workers.values()) {
            const state = worker.getHealthState();
            if (state === "paused") {
                await worker.resume();
            }
        }
    }

    async stopAll(): Promise<void> {
        for (const worker of this.workers.values()) {
            await worker.stop();
        }
    }

    getWorkerHealth(): Record<string, string> {
        const health: Record<string, string> = {};
        for (const worker of this.workers.values()) {
            health[worker.getWorkerName()] = worker.getHealthState();
        }
        return health;
    }
}
