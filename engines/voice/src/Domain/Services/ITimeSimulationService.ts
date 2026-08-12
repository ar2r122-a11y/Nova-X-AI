export interface ITimeSimulationService {
    getCurrentTime(): number;
    advance(seconds: number): void;
}

export interface IAudioCompressionService {
    compress(data: ArrayBuffer): Promise<{ data: ArrayBuffer; algorithm: string }>;
    decompress(data: ArrayBuffer, algorithm: string): Promise<ArrayBuffer>;
}

export interface IVoiceCacheService {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlMs?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}

export interface IMultiSpeakerCoordinator {
    resolveVoiceProfile(characterId: string): Promise<string | null>;
    queueAudio(stream: import("../../Contracts/IAudioStreamingWorker").StreamHandle, priority: number): Promise<void>;
    mix(): Promise<import("../ValueObjects/PCMBuffer").PCMBuffer | null>;
}
