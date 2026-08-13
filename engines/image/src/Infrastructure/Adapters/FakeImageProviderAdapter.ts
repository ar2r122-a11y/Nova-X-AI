import type { IImageProviderAdapter, GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../../Contracts/IImageProviderAdapter";

export class FakeImageProviderAdapter implements IImageProviderAdapter {
    private available = true;
    private latencyMs = 50;

    async executeGeneration(request: ImageGenerationRequest): Promise<GenerationResult> {
        await this.simulateLatency();
        const width = request.width || 1024;
        const height = request.height || 1024;
        const candidates = Array.from({ length: request.candidateCount || 1 }).map((_, i) => ({
            uri: FakeImageProviderAdapter.buildFakeImageUri(request.imageId, i, width, height),
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

    async executeStream(_request: ImageGenerationRequest): Promise<AsyncIterable<GenerationStreamChunk>> {
        const chunks: GenerationStreamChunk[] = Array.from({ length: 3 }).map((_, i) => ({
            providerId: "fake-provider",
            chunkIndex: i,
            totalChunks: 3,
            dataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#333"/><text x="32" y="32" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="10">chunk-${i}</text></svg>`)}`,
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

    private static buildFakeImageUri(_imageId: string, index: number, width: number, height: number): string {
        const fontSize = Math.max(12, Math.min(width, height) / 8);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="#1a1a2e"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#eaeaea" font-family="sans-serif" font-size="${fontSize}">Candidate ${index + 1}</text>
        </svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    private async simulateLatency(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    }
}
