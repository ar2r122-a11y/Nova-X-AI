
export class PromptCompilationResult {
    private readonly compiledPrompt: string;
    private readonly safetyFlags: string[];
    private readonly tokenCount: number;
    private readonly styleTokens: string[];
    private readonly visualTags: string[];

    private constructor(compiledPrompt: string, safetyFlags: string[], tokenCount: number, styleTokens: string[], visualTags: string[]) {
        this.compiledPrompt = compiledPrompt;
        this.safetyFlags = safetyFlags;
        this.tokenCount = tokenCount;
        this.styleTokens = styleTokens;
        this.visualTags = visualTags;
    }

    public static create(compiledPrompt: string, safetyFlags: string[] = [], tokenCount: number = 0, styleTokens: string[] = [], visualTags: string[] = []): PromptCompilationResult {
        return new PromptCompilationResult(compiledPrompt, safetyFlags, tokenCount, styleTokens, visualTags);
    }

    public getCompiledPrompt(): string {
        return this.compiledPrompt;
    }

    public get prompt(): string {
        return this.compiledPrompt;
    }

    public getSafetyFlags(): string[] {
        return this.safetyFlags;
    }

    public getTokenCount(): number {
        return this.tokenCount;
    }

    public getStyleTokens(): string[] {
        return this.styleTokens;
    }

    public getVisualTags(): string[] {
        return this.visualTags;
    }

    public hasSafetyFlag(flag: string): boolean {
        return this.safetyFlags.includes(flag);
    }
}
