import type { IImageProviderAdapter, GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../../Contracts/IImageProviderAdapter";

export class LocalStableDiffusionAdapter implements IImageProviderAdapter {
    async executeGeneration(request: ImageGenerationRequest): Promise<GenerationResult> {
        const width = request.width || 1024;
        const height = request.height || 1024;
        const candidates = Array.from({ length: request.candidateCount || 1 }).map((_, i) => ({
            uri: `local://${request.imageId}/candidate-${i}`,
            width,
            height,
            seed: request.seed ?? (Date.now() + i),
            score: 1 - i * 0.05
        }));
        return {
            success: true,
            candidates,
            providerId: "local-stable-diffusion",
            latencyMs: 150
        };
    }

    async executeStream(request: ImageGenerationRequest): Promise<AsyncIterable<GenerationStreamChunk>> {
        const chunks: GenerationStreamChunk[] = Array.from({ length: 3 }).map((_, i) => ({
            providerId: "local-stable-diffusion",
            chunkIndex: i,
            totalChunks: 3,
            dataUri: `local://stream/${request.imageId}/chunk-${i}`,
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
            latencyMs: 150,
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
            supportedModes: ["text-to-image", "image-to-image", "inpainting", "outpainting", "variation"],
            maxResolution: { width: 2048, height: 2048 },
            supportsStreaming: true,
            rateLimitRemaining: 100
        };
    }
}
