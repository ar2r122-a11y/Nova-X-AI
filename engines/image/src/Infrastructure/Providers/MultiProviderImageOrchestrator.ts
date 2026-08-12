import type { IImageProviderAdapter } from "../../Contracts/IImageProviderAdapter";
import type { GenerationResult, GenerationStreamChunk, ImageGenerationRequest } from "../../Domain/Services/ImageGenerationService";

export class MultiProviderImageOrchestrator {
    private readonly providers: Map<string, { adapter: IImageProviderAdapter; priority: number }> = new Map();

    registerProvider(name: string, adapter: IImageProviderAdapter, priority: number): void {
        this.providers.set(name, { adapter, priority });
    }

    async selectProvider(preferredModes: string[]): Promise<IImageProviderAdapter | null> {
        const available: Array<{ name: string; adapter: IImageProviderAdapter; priority: number }> = [];
        for (const [name, entry] of this.providers.entries()) {
            try {
                const health = await entry.adapter.getHealth();
                if (health.status === "healthy") {
                    available.push({ name, adapter: entry.adapter, priority: entry.priority });
                }
            } catch {
                continue;
            }
        }
        if (available.length === 0) {
            return null;
        }
        available.sort((a, b) => a.priority - b.priority);
        for (const entry of available) {
            try {
                const capabilities = await entry.adapter.getCapabilities();
                if (preferredModes.some((mode) => capabilities.supportedModes.includes(mode))) {
                    return entry.adapter;
                }
            } catch {
                continue;
            }
        }
        return available[0].adapter;
    }

    async executeGeneration(request: ImageGenerationRequest, preferredModes: string[]): Promise<GenerationResult> {
        let lastError: Error | null = null;
        for (const [, entry] of this.providers.entries()) {
            try {
                const capabilities = await entry.adapter.getCapabilities();
                if (!preferredModes.some((mode) => capabilities.supportedModes.includes(mode))) {
                    continue;
                }
                return await entry.adapter.executeGeneration(request);
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                continue;
            }
        }
        throw lastError || new Error("No available providers for image generation.");
    }

    async executeStream(request: ImageGenerationRequest, preferredModes: string[]): Promise<AsyncIterable<GenerationStreamChunk>> {
        const adapter = await this.selectProvider(preferredModes);
        if (!adapter) {
            throw new Error("No available providers for streaming.");
        }
        return adapter.executeStream(request);
    }
}
