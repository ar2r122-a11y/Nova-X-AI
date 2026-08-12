export interface ISynthesisOrchestrator {
    orchestrate(request: {
        text: string;
        voiceProfileId: string;
        providerId: string;
        correlationId: string;
        causationId: string;
    }): Promise<import("../ValueObjects/AudioChunk").AudioChunk[]>;
}

export interface IAudioPipeline {
    process(input: import("../ValueObjects/PCMBuffer").PCMBuffer): Promise<import("../ValueObjects/PCMBuffer").PCMBuffer>;
    normalize(buffer: import("../ValueObjects/PCMBuffer").PCMBuffer): Promise<import("../ValueObjects/PCMBuffer").PCMBuffer>;
}

export interface IProviderInvoker {
    invoke(request: {
        text: string;
        voiceProfileId: string;
        providerId: string;
        correlationId: string;
        causationId: string;
    }): AsyncIterable<import("../ValueObjects/AudioChunk").AudioChunk>;
    getProviderHealth(providerId: string): Promise<import("../ValueObjects/ProviderCostMetadata").ProviderCostMetadata>;
}

export interface IStreamManager {
    registerStream(request: import("../../Contracts/IAudioStreamingWorker").StreamRequest): Promise<import("../../Contracts/IAudioStreamingWorker").StreamHandle>;
    cancelStream(streamId: string): Promise<void>;
    getStream(streamId: string): import("../../Contracts/IAudioStreamingWorker").StreamHandle | null;
}

export interface IBufferManager {
    allocate(sizeBytes: number): boolean;
    release(sizeBytes: number): void;
    getAvailableBytes(): number;
    getUsedBytes(): number;
}

export interface ISchedulerService {
    schedule(task: import("../../Domain/Entities/ScheduledVoiceTaskEntity").ScheduledVoiceTaskEntity): Promise<void>;
    cancel(taskId: string): Promise<void>;
    getDueTasks(): Promise<import("../../Domain/Entities/ScheduledVoiceTaskEntity").ScheduledVoiceTaskEntity[]>;
}

export interface IAudioCompressionService {
    compressPCM(buffer: import("../ValueObjects/PCMBuffer").PCMBuffer, targetCodec: import("../ValueObjects/AudioCodec").AudioCodec): Promise<{ data: ArrayBuffer; codec: import("../ValueObjects/AudioCodec").AudioCodec }>;
    decompress(data: ArrayBuffer, codec: import("../ValueObjects/AudioCodec").AudioCodec): Promise<import("../ValueObjects/PCMBuffer").PCMBuffer>;
}

export interface IVoiceCacheService {
    get(key: string): Promise<unknown | null>;
    set(key: string, value: unknown, ttlMs?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}

export interface IMultiSpeakerCoordinator {
    resolveVoiceProfile(characterId: string): Promise<string | null>;
    queueAudio(stream: import("../../Contracts/IAudioStreamingWorker").StreamHandle, priority: number): Promise<void>;
    mix(): Promise<import("../ValueObjects/PCMBuffer").PCMBuffer | null>;
}

export interface IVoiceDomainService {
    validateSynthesisRequest(text: string, voiceProfileId: string): void;
    selectProvider(context: { freeOnly: boolean; providerHint?: string }): Promise<import("../ValueObjects/VoiceProviderId").VoiceProviderId>;
    estimateCost(providerId: string, text: string): Promise<import("../ValueObjects/ProviderCostMetadata").ProviderCostMetadata>;
}
