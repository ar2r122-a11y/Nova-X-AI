import type { GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../Domain/Services/ImageGenerationService";

export type { GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../Domain/Services/ImageGenerationService";

export interface IImageProviderAdapter {
    executeGeneration(request: ImageGenerationRequest): Promise<GenerationResult>;
    executeStream(request: ImageGenerationRequest): Promise<AsyncIterable<GenerationStreamChunk>>;
    isAvailable(): Promise<boolean>;
    getHealth(): Promise<{ status: string; latencyMs: number; lastChecked: number }>;
    getCapabilities(): Promise<{
        supportedModes: string[];
        maxResolution: { width: number; height: number };
        supportsStreaming: boolean;
        rateLimitRemaining: number;
    }>;
}
