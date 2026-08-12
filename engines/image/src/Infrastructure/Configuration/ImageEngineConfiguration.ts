export interface ImageEngineConfiguration {
    candidateCount: number;
    batchSize: number;
    thumbnailSizes: string[];
    maxVRAM: number;
    maxConcurrentJobs: number;
    timeouts: {
        generation: number;
        streaming: number;
        recovery: number;
        scheduling: number;
    };
    retryCount: number;
    cacheLimits: {
        hotCache: number;
        snapshotStore: number;
    };
    retention: {
        assetsDays: number;
        snapshotsDays: number;
    };
    moderationSensitivity: string;
    watermarkPolicy: string;
    compressionProfile: string;
    streamingSettings: {
        enabled: boolean;
        chunkSize: number;
        maxConcurrentStreams: number;
    };
    freeFirstMode: boolean;
    providers: {
        local: { enabled: boolean; endpoint?: string };
        free: { enabled: boolean; endpoint?: string };
        cloud: { enabled: boolean; endpoint?: string };
    };
}
