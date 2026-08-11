import type { IStoryWorker } from "./IStoryWorker";

export interface IWorkerLifecycleManager {
    registerWorker(worker: IStoryWorker): void;
    startAll(): Promise<void>;
    pauseAll(): Promise<void>;
    resumeAll(): Promise<void>;
    stopAll(): Promise<void>;
    getWorkerHealth(): Record<string, string>;
}
