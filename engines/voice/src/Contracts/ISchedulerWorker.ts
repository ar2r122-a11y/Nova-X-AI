export interface ISchedulerWorker {
    readonly workerName: string;
    setEngine(engine: import("./IVoiceEngine").IVoiceEngine): void;
    configure(config: import("./Runtime/index").RuntimeConfiguration): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    isRunning(): boolean;
    getHealth(): import("./IAudioStreamingWorker").WorkerHealthReport;
    schedule(task: import("../Domain/Entities/ScheduledVoiceTaskEntity").ScheduledVoiceTaskEntity): Promise<void>;
    cancel(taskId: string): Promise<void>;
}
