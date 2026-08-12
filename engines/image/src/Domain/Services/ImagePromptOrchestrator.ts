import { PromptCompilationResult } from "../ValueObjects/PromptCompilationResult";
import { ImageDimensions } from "../ValueObjects/ImageDimensions";

export class ImagePromptOrchestrator {
    public compilePrompt(params: {
        originalPrompt: string;
        negativePrompt?: string;
        visualTags?: string[];
        styleTokens?: string[];
        environmentalModifiers?: string[];
        maxTokens?: number;
    }): PromptCompilationResult {
        const maxTokens = params.maxTokens ?? 512;
        let compiled = params.originalPrompt.trim();
        const safetyFlags: string[] = [];
        const styleTokens: string[] = params.styleTokens ?? [];
        const visualTags: string[] = params.visualTags ?? [];

        const forbiddenPatterns = [
            /\b(?:nsfw|explicit|gore|violence|hate|harassment)\b/i
        ];
        for (const pattern of forbiddenPatterns) {
            if (pattern.test(compiled)) {
                safetyFlags.push("blocked_term");
                compiled = compiled.replace(pattern, "[filtered]");
            }
        }

        if (params.visualTags && params.visualTags.length > 0) {
            compiled = `${compiled}, ${params.visualTags.join(", ")}`;
        }
        if (params.styleTokens && params.styleTokens.length > 0) {
            compiled = `${compiled}, style: ${params.styleTokens.join(", ")}`;
        }

        const tokenCount = Math.floor(compiled.split(/\s+/).length * 1.3);
        if (tokenCount > maxTokens) {
            const words = compiled.split(/\s+/);
            const truncated = words.slice(0, Math.floor(maxTokens / 1.3)).join(" ");
            compiled = `${truncated}...`;
        }

        return PromptCompilationResult.create(compiled, safetyFlags, Math.min(tokenCount, maxTokens), styleTokens, visualTags);
    }

    public sanitizePrompt(prompt: string): string {
        let sanitized = prompt.trim();
        const forbiddenPatterns = [
            /\b(?:nsfw|explicit|gore|violence|hate|harassment)\b/i
        ];
        for (const pattern of forbiddenPatterns) {
            if (pattern.test(sanitized)) {
                sanitized = sanitized.replace(pattern, "[filtered]");
            }
        }
        return sanitized;
    }

    public applySafetyChecks(prompt: string): string[] {
        const flags: string[] = [];
        const forbiddenPatterns = [
            /\b(?:nsfw|explicit|gore|violence|hate|harassment)\b/i
        ];
        for (const pattern of forbiddenPatterns) {
            if (pattern.test(prompt)) {
                flags.push("blocked_term");
            }
        }
        return flags;
    }

    public injectVisualTags(prompt: string, tags: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (tags.length === 0) {
            return sanitized;
        }
        return `${sanitized}, ${tags.join(", ")}`;
    }

    public applyStyleTokens(prompt: string, styles: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (styles.length === 0) {
            return sanitized;
        }
        return `${sanitized}, style: ${styles.join(", ")}`;
    }

    public applyEnvironmentalModifiers(prompt: string, modifiers: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (modifiers.length === 0) {
            return sanitized;
        }
        return `${sanitized}, ${modifiers.join(", ")}`;
    }

    public normalizeDimensions(dimensions: ImageDimensions, maxResolution: number): ImageDimensions {
        let width = dimensions.getWidth();
        let height = dimensions.getHeight();
        if (width > maxResolution || height > maxResolution) {
            const scale = maxResolution / Math.max(width, height);
            width = Math.floor(width * scale);
            height = Math.floor(height * scale);
        }
        return ImageDimensions.create(width, height);
    }
}
