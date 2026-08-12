import type { IImageProviderAdapter } from "../../Contracts/IImageProviderAdapter";

export interface StyleConsistencyConfig {
    referenceImageUri?: string;
    styleKeywords: string[];
    consistencyStrength: number;
}

export class StyleConsistencyCoordinator {
    private readonly adapters: Map<string, IImageProviderAdapter> = new Map();

    registerAdapter(name: string, adapter: IImageProviderAdapter): void {
        this.adapters.set(name, adapter);
    }

    async buildConsistentPrompt(basePrompt: string, config: StyleConsistencyConfig): Promise<string> {
        let prompt = basePrompt;
        if (config.referenceImageUri) {
            prompt = `${prompt}, matching reference image style`;
        }
        if (config.styleKeywords.length > 0) {
            prompt = `${prompt}, ${config.styleKeywords.join(", ")}`;
        }
        return prompt;
    }

    async applyConsistencyToGeneration(
        adapter: IImageProviderAdapter,
        baseRequest: { prompt: string; negativePrompt: string; width: number; height: number; seed?: number; steps?: number; cfgScale?: number },
        config: StyleConsistencyConfig
    ): Promise<any> {
        const consistentPrompt = await this.buildConsistentPrompt(baseRequest.prompt, config);
        const result = await adapter.executeGeneration({
            imageId: "consistent-gen",
            prompt: consistentPrompt,
            negativePrompt: baseRequest.negativePrompt,
            mode: "text-to-image",
            aspectRatio: `${baseRequest.width}:${baseRequest.height}`,
            width: baseRequest.width,
            height: baseRequest.height,
            seed: baseRequest.seed ?? null,
            steps: baseRequest.steps ?? 20,
            cfgScale: baseRequest.cfgScale ?? 7.0,
            candidateCount: 1
        } as any);
        return result;
    }
}
