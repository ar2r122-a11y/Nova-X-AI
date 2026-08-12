import { ImageEngineConfiguration } from "../Infrastructure/Configuration/ImageEngineConfiguration";

export const DEFAULT_IMAGE_ENGINE_CONFIGURATION: ImageEngineConfiguration = {
    candidateCount: 4,
    batchSize: 8,
    thumbnailSizes: ["256x256", "512x512", "1024x1024"],
    maxVRAM: 4096,
    maxConcurrentJobs: 2,
    timeouts: {
        generation: 120000,
        streaming: 300000,
        recovery: 60000,
        scheduling: 5000
    },
    retryCount: 2,
    cacheLimits: {
        hotCache: 100,
        snapshotStore: 1000
    },
    retention: {
        assetsDays: 30,
        snapshotsDays: 7
    },
    moderationSensitivity: "medium",
    watermarkPolicy: "none",
    compressionProfile: "high",
    streamingSettings: {
        enabled: true,
        chunkSize: 65536,
        maxConcurrentStreams: 2
    },
    freeFirstMode: true,
    providers: {
        local: { enabled: true, endpoint: "http://localhost:7860" },
        free: { enabled: true, endpoint: "https://api.freeprovider.example" },
        cloud: { enabled: false, endpoint: "https://api.cloudprovider.example" }
    }
};
