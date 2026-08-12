export type VoiceRuntimeState = "initialized" | "waiting_for_input" | "synthesizing" | "streaming_audio" | "buffering" | "awaiting_stt" | "processing_transcription" | "completed" | "paused" | "failed" | "recovering";

export interface RuntimeConfiguration {
    readonly synthesisTimeoutMs: number;
    readonly providerTimeoutMs: number;
    readonly maxConcurrentStreams: number;
    readonly audioRingBufferBytes: number;
    readonly maxAudioBitrateKbps: number;
    readonly maxInputCharacters: number;
    readonly chunkSizeBytes: number;
    readonly timeToFirstAudioSoftMs: number;
    readonly timeToFirstAudioHardMs: number;
    readonly maxConsecutiveFailures: number;
    readonly recoveryTimeoutMs: number;
    readonly schedulerIntervalMs: number;
    readonly maxScheduledTasks: number;
    readonly cleanupIntervalMs: number;
    readonly projectionSyncIntervalMs: number;
    readonly enableFreeFirstProvider: boolean;
    readonly maxRetries: number;
    readonly retryBackoffMs: number;
    readonly maxRetryBackoffMs: number;
}

export interface RuntimeHealthStatus {
    readonly status: "healthy" | "degraded" | "unhealthy" | "failed";
    readonly runtimeState: string;
    readonly uptimeMs: number;
    readonly workers: import("../IAudioStreamingWorker").WorkerHealthReport[];
    readonly checks: { name: string; healthy: boolean; message?: string; durationMs: number }[];
    readonly timestamp: number;
}

export function isValidRuntimeTransition(current: VoiceRuntimeState, target: VoiceRuntimeState): boolean {
    const validTransitions: Record<string, string[]> = {
        "initialized": ["waiting_for_input"],
        "waiting_for_input": ["synthesizing", "paused", "recovering"],
        "synthesizing": ["streaming_audio", "failed", "buffering"],
        "streaming_audio": ["completed", "failed", "buffering"],
        "buffering": ["streaming_audio", "failed"],
        "awaiting_stt": ["processing_transcription", "failed"],
        "processing_transcription": ["completed", "failed", "waiting_for_input"],
        "completed": ["waiting_for_input"],
        "paused": ["waiting_for_input"],
        "failed": ["recovering", "waiting_for_input"],
        "recovering": ["waiting_for_input"]
    };

    return validTransitions[current]?.includes(target) ?? false;
}

export * from "./IVoiceRuntime";
