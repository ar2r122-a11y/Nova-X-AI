export class ImagePromptSanitizer {
    sanitizePrompt(prompt: string): string {
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

    injectVisualTags(prompt: string, tags: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (tags.length === 0) {
            return sanitized;
        }
        return `${sanitized}, ${tags.join(", ")}`;
    }

    applyStyleTokens(prompt: string, styles: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (styles.length === 0) {
            return sanitized;
        }
        return `${sanitized}, style: ${styles.join(", ")}`;
    }

    applyEnvironmentalModifiers(prompt: string, modifiers: string[]): string {
        const sanitized = this.sanitizePrompt(prompt);
        if (modifiers.length === 0) {
            return sanitized;
        }
        return `${sanitized}, ${modifiers.join(", ")}`;
    }

    compilePrompt(params: {
        basePrompt: string;
        negativePrompt?: string;
        visualTags?: string[];
        styleTokens?: string[];
        environmentalModifiers?: string[];
    }): { prompt: string; negativePrompt: string } {
        let prompt = params.basePrompt;
        if (params.visualTags && params.visualTags.length > 0) {
            prompt = this.injectVisualTags(prompt, params.visualTags);
        }
        if (params.styleTokens && params.styleTokens.length > 0) {
            prompt = this.applyStyleTokens(prompt, params.styleTokens);
        }
        if (params.environmentalModifiers && params.environmentalModifiers.length > 0) {
            prompt = this.applyEnvironmentalModifiers(prompt, params.environmentalModifiers);
        }
        const negativePrompt = params.negativePrompt ? this.sanitizePrompt(params.negativePrompt) : "";
        return { prompt, negativePrompt };
    }
}
