export interface ICharacterWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}
