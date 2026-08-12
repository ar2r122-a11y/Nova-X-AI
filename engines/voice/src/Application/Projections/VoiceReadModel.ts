export interface VoiceReadModel {
    readonly voiceId: string;
    readonly voiceState: string;
    readonly providerId: string;
    readonly version: number;
    readonly lastRequestId: string | null;
    readonly totalAudioDurationMs: number;
    readonly totalChunksProcessed: number;
    readonly consecutiveFailures: number;
    readonly updatedAt: number;
}

export interface VoiceSessionReadModel {
    readonly sessionId: string;
    readonly voiceId: string;
    readonly profileId: string;
    readonly sessionState: string;
    readonly startedAt: number;
    readonly endedAt: number | null;
    readonly totalAudioDurationMs: number;
    readonly text: string;
    readonly updatedAt: number;
}

export interface ProviderHealthReadModel {
    readonly providerId: string;
    readonly status: string;
    readonly latencyMs: number;
    readonly lastChecked: number;
    readonly errorCount: number;
    readonly successCount: number;
}
