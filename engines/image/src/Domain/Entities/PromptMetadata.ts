export interface PromptMetadata {
    readonly originalPrompt: string;
    readonly compiledPrompt: string;
    readonly safetyFlags: string[];
    readonly tokenCount: number;
    readonly injectedVisualTags: string[];
    readonly styleTokens: string[];
    readonly environmentalModifiers: string[];
    readonly characterVisualConsistency: string;
}
