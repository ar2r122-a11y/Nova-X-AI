export interface IBackgroundScheduler {

    start(): Promise<void>;

    stop(): Promise<void>;

    schedule(
        name: string,
        task: () => Promise<void>,
        intervalMs: number
    ): void;

    cancel(
        name: string
    ): void;

    isRunning(): boolean;

}