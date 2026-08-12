export interface IImageWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}
