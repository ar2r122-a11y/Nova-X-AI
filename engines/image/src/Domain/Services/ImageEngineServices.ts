
import { PromptCompilationResult } from "../ValueObjects/PromptCompilationResult";

export class ImagePromptOrchestrator {
    private readonly visualTagInjections: Record<string, string[]>;

    constructor(visualTagInjections: Record<string, string[]> = {}) {
        this.visualTagInjections = visualTagInjections;
    }

    compilePrompt(basePrompt: string | { originalPrompt: string }, metadata: Record<string, unknown> = {}): PromptCompilationResult {
        const prompt = typeof basePrompt === "string" ? basePrompt : basePrompt.originalPrompt;
        const sanitized = this.sanitizePrompt(prompt);
        const tags = this.injectVisualTags(sanitized);
        const compiled = `${sanitized}, ${tags.join(", ")}`.trim();
        return PromptCompilationResult.create(compiled, [], 0, (metadata.styleTokens as string[]) || [], (metadata.visualTags as string[]) || []);
    }

    sanitizePrompt(prompt: string): string {
        return prompt.trim().slice(0, 10000);
    }

    injectVisualTags(prompt: string): string[] {
        const tags: string[] = [];
        const lower = prompt.toLowerCase();
        for (const [keyword, tagList] of Object.entries(this.visualTagInjections)) {
            if (lower.includes(keyword)) {
                tags.push(...tagList);
            }
        }
        return tags;
    }
}

export class ResourceAllocator {
    private readonly totalVRAM: number;
    private readonly totalMemory: number;
    private allocated: { vram: number; memory: number };

    constructor(totalVRAM: number, totalMemory: number) {
        this.totalVRAM = totalVRAM;
        this.totalMemory = totalMemory;
        this.allocated = { vram: 0, memory: 0 };
    }

    allocate(vram: number, memory: number): boolean {
        if (this.allocated.vram + vram > this.totalVRAM) return false;
        if (this.allocated.memory + memory > this.totalMemory) return false;
        this.allocated.vram += vram;
        this.allocated.memory += memory;
        return true;
    }

    release(vram: number, memory: number): void {
        this.allocated.vram = Math.max(0, this.allocated.vram - vram);
        this.allocated.memory = Math.max(0, this.allocated.memory - memory);
    }

    getAvailableVRAM(): number {
        return this.totalVRAM - this.allocated.vram;
    }

    getAvailableMemory(): number {
        return this.totalMemory - this.allocated.memory;
    }
}

export class ImageCompressionEngine {
    compress(data: ArrayBuffer, _format: string, _quality: number = 0.9): ArrayBuffer {
        const input = new Uint8Array(data);
        const output = new Uint8Array(input.length);
        let j = 0;
        for (let i = 0; i < input.length; i += 3) {
            if (j < output.length) {
                output[j++] = input[i];
            }
        }
        return output.slice(0, j).buffer;
    }

    estimateCompressedSize(_data: ArrayBuffer, _format: string): number {
        return _data.byteLength / 2;
    }
}

export class ImageDeduplicationEngine {
    private readonly seenHashes: Set<string>;

    constructor() {
        this.seenHashes = new Set();
    }

    computeHash(data: ArrayBuffer): string {
        const view = new Uint8Array(data);
        let hash = 0;
        for (let i = 0; i < view.length; i++) {
            hash = ((hash << 5) - hash + view[i]) | 0;
        }
        return `hash-${Math.abs(hash)}`;
    }

    isDuplicate(data: ArrayBuffer): boolean {
        const hash = this.computeHash(data);
        if (this.seenHashes.has(hash)) {
            return true;
        }
        this.seenHashes.add(hash);
        return false;
    }

    clear(): void {
        this.seenHashes.clear();
    }
}

export class ImageThumbnailGenerator {
    generate(data: ArrayBuffer, size: { width: number; height: number }): ArrayBuffer {
        const input = new Uint8Array(data);
        const output = new Uint8Array(size.width * size.height * 3);
        let j = 0;
        for (let i = 0; i < output.length && j < input.length; i++) {
            output[i] = input[j++];
        }
        return output.buffer;
    }

    getThumbnailDimensions(targetSize: number): { width: number; height: number } {
        return { width: targetSize, height: targetSize };
    }
}

export class ImageModerationService {
    moderate(_data: ArrayBuffer, rating: string): boolean {
        return rating !== "unsafe" && rating !== "explicit";
    }

    isSafeForWork(rating: string): boolean {
        return rating === "safe" || rating === "questionable";
    }
}

export class ProviderSelectionService {
    private readonly providers: string[];
    private currentIndex: number;

    constructor(providers: string[]) {
        this.providers = providers;
        this.currentIndex = 0;
    }

    select(next: boolean = true): string {
        if (this.providers.length === 0) {
            throw new Error("No providers available.");
        }
        const provider = this.providers[this.currentIndex];
        if (next) {
            this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        }
        return provider;
    }

    getCurrentProvider(): string {
        return this.providers[this.currentIndex];
    }
}
