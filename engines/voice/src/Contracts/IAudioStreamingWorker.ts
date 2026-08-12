export interface WorkerContext {
    readonly engine: import("./IVoiceEngine").IVoiceEngine;
    readonly voiceId: import("../Domain/ValueObjects/VoiceId").VoiceId;
    readonly config: import("./Runtime/index").RuntimeConfiguration;
}

export interface IAudioStreamingWorker {
    readonly workerName: string;
    setEngine(engine: import("./IVoiceEngine").IVoiceEngine): void;
    setVoiceId(voiceId: import("../Domain/ValueObjects/VoiceId").VoiceId): void;
    configure(config: import("./Runtime/index").RuntimeConfiguration): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    isRunning(): boolean;
    getHealth(): WorkerHealthReport;
    enqueueStream(request: StreamRequest): Promise<StreamHandle>;
    cancelStream(streamId: string): Promise<void>;
}

export interface StreamRequest {
    readonly streamId: string;
    readonly text: string;
    readonly voiceProfileId: string;
    readonly providerId: string;
    readonly correlationId: string;
    readonly causationId: string;
}

export interface StreamHandle {
    readonly streamId: string;
    readonly audioChunkIterator: AsyncIterable<import("../Domain/ValueObjects/AudioChunk").AudioChunk>;
}

export interface WorkerHealthReport {
    readonly workerName: string;
    readonly isRunning: boolean;
    readonly lastTickDurationMs: number;
    readonly failureCount: number;
    readonly lastError?: string;
    readonly status: "healthy" | "degraded" | "unhealthy";
}
