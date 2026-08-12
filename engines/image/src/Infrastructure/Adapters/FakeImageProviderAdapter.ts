import type { IImageProviderAdapter, GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../../Contracts/IImageProviderAdapter";

export class FakeImageProviderAdapter implements IImageProviderAdapter {
    private available = true;
    private latencyMs = 50;

    async executeGeneration(request: ImageGenerationRequest): Promise<GenerationResult> {
        await this.simulateLatency();
        const width = request.width || 1024;
        const height = request.height || 1024;
        const candidates = Array.from({ length: request.candidateCount || 1 }).map((_, i) => ({
            uri: `fake://image/${request.imageId}/candidate-${i}`,
            width,
            height,
            seed: request.seed ?? (Date.now() + i),
            score: 1 - i * 0.1
        }));
        return {
            success: true,
            candidates,
            providerId: "fake-provider",
            latencyMs: this.latencyMs
        };
    }

    async executeStream(request: ImageGenerationRequest): Promise<AsyncIterable<GenerationStreamChunk>> {
        const chunks: GenerationStreamChunk[] = Array.from({ length: 3 }).map((_, i) => ({
            providerId: "fake-provider",
            chunkIndex: i,
            totalChunks: 3,
            dataUri: `fake://stream/${request.imageId}/chunk-${i}`,
            isFinal: i === 2,
            metadata: {}
        }));
        await this.simulateLatency();
        return (async function* () {
            for (const chunk of chunks) {
                yield chunk;
            }
        })();
    }

    async isAvailable(): Promise<boolean> {
        return this.available;
    }

    async getHealth(): Promise<{ status: string; latencyMs: number; lastChecked: number }> {
        return {
            status: this.available ? "healthy" : "unavailable",
            latencyMs: this.latencyMs,
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
            supportedModes: ["textToImage", "imageToImage", "variation"],
            maxResolution: { width: 1024, height: 1024 },
            supportsStreaming: true,
            rateLimitRemaining: 999
        };
    }

    setAvailable(available: boolean): void {
        this.available = available;
    }

    setLatencyMs(latencyMs: number): void {
        this.latencyMs = latencyMs;
    }

    private async simulateLatency(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    }
}
