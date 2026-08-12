export interface IVoiceRecoveryWorker {
    readonly workerName: string;
    setEngine(engine: import("./IVoiceEngine").IVoiceEngine): void;
    setVoiceId(voiceId: import("../Domain/ValueObjects/VoiceId").VoiceId): void;
    configure(config: import("./Runtime/index").RuntimeConfiguration): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    isRunning(): boolean;
    getHealth(): import("./IAudioStreamingWorker").WorkerHealthReport;
    recover(sessionId: string, reason: string): Promise<void>;
}
