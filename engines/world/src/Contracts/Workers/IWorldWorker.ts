import type { WorkerState, WorkerHealthReport, RuntimeConfiguration } from "../index";

export interface IWorldWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
    getHealth(): WorkerHealthReport;
    configure(config: RuntimeConfiguration): void;
}
