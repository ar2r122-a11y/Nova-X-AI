export interface IImagePromptOrchestrator {
    compilePrompt(params: {
        basePrompt: string;
        negativePrompt?: string;
        visualTags?: string[];
        styleTokens?: string[];
        environmentalModifiers?: string[];
    }): { prompt: string; negativePrompt: string };

    sanitizePrompt(prompt: string): string;
    injectVisualTags(prompt: string, tags: string[]): string;
    applyStyleTokens(prompt: string, tokens: string[]): string;
    applyEnvironmentalModifiers(prompt: string, modifiers: string[]): string;
}
