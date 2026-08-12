export interface ImageGenerationRequest {
    readonly imageId: string;
    readonly prompt: string;
    readonly negativePrompt: string;
    readonly width: number;
    readonly height: number;
    readonly seed: number | null | undefined;
    readonly steps?: number;
    readonly cfgScale?: number;
    readonly candidateCount: number;
    readonly mode: string;
    readonly visualTags?: string[];
    readonly styleTokens?: string[];
    readonly environmentalModifiers?: string[];
}

export interface GenerationResult {
    readonly success: boolean;
    readonly candidates: Array<{
        readonly uri: string;
        readonly width: number;
        readonly height: number;
        readonly seed: number;
        readonly score: number;
    }>;
    readonly providerId: string;
    readonly latencyMs: number;
}

export interface GenerationStreamChunk {
    readonly providerId: string;
    readonly chunkIndex: number;
    readonly totalChunks: number;
    readonly dataUri: string;
    readonly isFinal: boolean;
    readonly metadata: Record<string, unknown>;
}
