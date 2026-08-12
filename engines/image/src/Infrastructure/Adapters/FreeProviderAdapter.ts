import type { IImageProviderAdapter, GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../../Contracts/IImageProviderAdapter";

export class FreeProviderAdapter implements IImageProviderAdapter {
    async executeGeneration(request: ImageGenerationRequest): Promise<GenerationResult> {
        const width = request.width || 1024;
        const height = request.height || 1024;
        const candidates = Array.from({ length: request.candidateCount || 1 }).map((_, i) => ({
            uri: `free://${request.imageId}/candidate-${i}`,
            width,
            height,
            seed: request.seed ?? (Date.now() + i),
            score: 1 - i * 0.08
        }));
        return {
            success: true,
            candidates,
            providerId: "free-provider",
            latencyMs: 300
        };
    }

    async executeStream(request: ImageGenerationRequest): Promise<AsyncIterable<GenerationStreamChunk>> {
        const chunks: GenerationStreamChunk[] = Array.from({ length: 3 }).map((_, i) => ({
            providerId: "free-provider",
            chunkIndex: i,
            totalChunks: 3,
            dataUri: `free://stream/${request.imageId}/chunk-${i}`,
            isFinal: i === 2,
            metadata: {}
        }));
        return (async function* () {
            for (const chunk of chunks) {
                yield chunk;
            }
        })();
    }

    async isAvailable(): Promise<boolean> {
        return true;
    }

    async getHealth(): Promise<{ status: string; latencyMs: number; lastChecked: number }> {
        return {
            status: "healthy",
            latencyMs: 300,
            lastChecked: Date.now()
        };
    }

    async getCapabilities(): Promise<{
        supportedModes: string[];
        maxResolution: { width: number; height: number };
        supportsStreaming: boolean;
        rateLimitRemaining: number;
    }> {
        return {
            supportedModes: ["text-to-image", "image-to-image", "variation"],
            maxResolution: { width: 1024, height: 1024 },
            supportsStreaming: true,
            rateLimitRemaining: 50
        };
    }
}
