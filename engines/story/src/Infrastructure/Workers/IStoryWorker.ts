import { WorkerHealthState } from "../../Domain/ValueObjects/WorkerHealthState";

export interface IStoryWorker {
    getWorkerName(): string;
    start(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    stop(): Promise<void>;
    getHealthState(): WorkerHealthState;
    isRunning(): boolean;
}
