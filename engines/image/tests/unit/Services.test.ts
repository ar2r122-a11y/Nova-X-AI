import { describe, it, expect } from "vitest";
import {
    ImagePromptOrchestrator,
    ResourceAllocator,
    ImageCompressionEngine,
    ImageDeduplicationEngine,
    ImageThumbnailGenerator,
    ImageModerationService,
    ProviderSelectionService
} from "../../src/Domain/Services/ImageEngineServices";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageInvariantsValidator } from "../../src/Domain/Services/ImageInvariantsValidator";
import { ImagePromptSanitizer } from "../../src/Domain/Services/ImagePromptSanitizer";

describe("Services", () => {
    describe("ImagePromptOrchestrator", () => {
        it("should compile prompt with metadata", () => {
            const orchestrator = new ImagePromptOrchestrator({ cat: ["feline", "pet"] });
            const result = orchestrator.compilePrompt("a cat sitting", { userId: "user-1" });
            expect(result.prompt).toContain("a cat sitting");
            expect(result.prompt).toContain("feline");
            expect(result.prompt).toContain("pet");
        });

        it("should sanitize prompt", () => {
            const orchestrator = new ImagePromptOrchestrator();
            const result = orchestrator.compilePrompt("  hello   world  ");
            expect(result.prompt).toBe("hello   world,");
        });

        it("should truncate long prompts", () => {
            const orchestrator = new ImagePromptOrchestrator();
            const longPrompt = "a".repeat(20000);
            const result = orchestrator.compilePrompt(longPrompt);
            expect(result.prompt.length).toBeLessThanOrEqual(10001);
        });

        it("should inject visual tags", () => {
            const orchestrator = new ImagePromptOrchestrator({ dog: ["canine", "pet"], sun: ["bright", "warm"] });
            const result = orchestrator.compilePrompt("a dog in the sun");
            expect(result.prompt).toContain("canine");
            expect(result.prompt).toContain("pet");
            expect(result.prompt).toContain("bright");
            expect(result.prompt).toContain("warm");
        });
    });

    describe("ResourceAllocator", () => {
        it("should allocate resources", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            expect(allocator.allocate(1024, 2048)).toBe(true);
            expect(allocator.getAvailableVRAM()).toBe(7168);
            expect(allocator.getAvailableMemory()).toBe(14336);
        });

        it("should deny when insufficient resources", () => {
            const allocator = new ResourceAllocator(1024, 2048);
            allocator.allocate(1024, 2048);
            expect(allocator.allocate(512, 512)).toBe(false);
        });

        it("should release resources", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            allocator.allocate(1024, 2048);
            allocator.release(512, 1024);
            expect(allocator.getAvailableVRAM()).toBe(7680);
            expect(allocator.getAvailableMemory()).toBe(15360);
        });
    });

    describe("ImageCompressionEngine", () => {
        it("should compress data", () => {
            const engine = new ImageCompressionEngine();
            const input = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]).buffer;
            const output = engine.compress(input, ImageFormat.PNG, 0.9);
            expect(output.byteLength).toBeGreaterThan(0);
        });

        it("should estimate compressed size", () => {
            const engine = new ImageCompressionEngine();
            const input = new ArrayBuffer(10000);
            const estimated = engine.estimateCompressedSize(input, ImageFormat.WEBP);
            expect(estimated).toBe(5000);
        });
    });

    describe("ImageDeduplicationEngine", () => {
        it("should detect duplicates", () => {
            const engine = new ImageDeduplicationEngine();
            const data1 = new Uint8Array([1, 2, 3]).buffer;
            const data2 = new Uint8Array([1, 2, 3]).buffer;
            expect(engine.isDuplicate(data1)).toBe(false);
            expect(engine.isDuplicate(data2)).toBe(true);
        });

        it("should not flag different data as duplicate", () => {
            const engine = new ImageDeduplicationEngine();
            const data1 = new Uint8Array([1, 2, 3]).buffer;
            const data2 = new Uint8Array([4, 5, 6]).buffer;
            expect(engine.isDuplicate(data1)).toBe(false);
            expect(engine.isDuplicate(data2)).toBe(false);
        });

        it("should clear cache", () => {
            const engine = new ImageDeduplicationEngine();
            const data = new Uint8Array([1, 2, 3]).buffer;
            engine.isDuplicate(data);
            engine.clear();
            expect(engine.isDuplicate(data)).toBe(false);
        });
    });

    describe("ImageThumbnailGenerator", () => {
        it("should generate thumbnail", () => {
            const generator = new ImageThumbnailGenerator();
            const input = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]).buffer;
            const output = generator.generate(input, { width: 64, height: 64 });
            expect(output.byteLength).toBeGreaterThan(0);
        });

        it("should return correct dimensions", () => {
            const generator = new ImageThumbnailGenerator();
            expect(generator.getThumbnailDimensions(128)).toEqual({ width: 128, height: 128 });
        });
    });

    describe("ImageModerationService", () => {
        it("should allow safe content", () => {
            const service = new ImageModerationService();
            expect(service.moderate(new ArrayBuffer(1024), "safe")).toBe(true);
            expect(service.isSafeForWork("safe")).toBe(true);
        });

        it("should reject unsafe content", () => {
            const service = new ImageModerationService();
            expect(service.moderate(new ArrayBuffer(1024), "unsafe")).toBe(false);
            expect(service.isSafeForWork("unsafe")).toBe(false);
        });

        it("should allow questionable content", () => {
            const service = new ImageModerationService();
            expect(service.moderate(new ArrayBuffer(1024), "questionable")).toBe(true);
            expect(service.isSafeForWork("questionable")).toBe(true);
        });
    });

    describe("ProviderSelectionService", () => {
        it("should select provider", () => {
            const service = new ProviderSelectionService(["p1", "p2", "p3"]);
            expect(service.select(false)).toBe("p1");
        });

        it("should rotate providers", () => {
            const service = new ProviderSelectionService(["p1", "p2"]);
            service.select(true);
            expect(service.getCurrentProvider()).toBe("p2");
            service.select(true);
            expect(service.getCurrentProvider()).toBe("p1");
        });

        it("should throw when no providers", () => {
            const service = new ProviderSelectionService([]);
            expect(() => service.select()).toThrow();
        });
    });

    describe("ImageInvariantsValidator", () => {
        it("should validate prompt", () => {
            expect(() => ImageInvariantsValidator.validatePrompt("")).toThrow();
            expect(() => ImageInvariantsValidator.validatePrompt("a".repeat(10001))).toThrow();
            expect(() => ImageInvariantsValidator.validatePrompt("valid prompt")).not.toThrow();
        });

        it("should validate negative prompt", () => {
            expect(() => ImageInvariantsValidator.validateNegativePrompt("a".repeat(5001))).toThrow();
            expect(() => ImageInvariantsValidator.validateNegativePrompt("valid")).not.toThrow();
        });

        it("should validate candidate count", () => {
            expect(() => ImageInvariantsValidator.validateCandidateCount(0, 8)).toThrow();
            expect(() => ImageInvariantsValidator.validateCandidateCount(9, 8)).toThrow();
            expect(() => ImageInvariantsValidator.validateCandidateCount(4, 8)).not.toThrow();
        });

        it("should validate dimensions", () => {
            expect(() => ImageInvariantsValidator.validateDimensions(32, 32)).toThrow();
            expect(() => ImageInvariantsValidator.validateDimensions(16384, 16384)).toThrow();
            expect(() => ImageInvariantsValidator.validateDimensions(512, 512)).not.toThrow();
        });

        it("should validate provider availability", () => {
            expect(() => ImageInvariantsValidator.validateProviderAvailability("", true)).toThrow();
            expect(() => ImageInvariantsValidator.validateProviderAvailability("p1", false)).toThrow();
            expect(() => ImageInvariantsValidator.validateProviderAvailability("p1", true)).not.toThrow();
        });
    });

    describe("ImagePromptSanitizer", () => {
        it("should sanitize prompt", () => {
            const sanitizer = new ImagePromptSanitizer();
            expect(sanitizer.sanitizePrompt("  hello   world  ")).toBe("hello   world");
        });

        it("should filter forbidden patterns", () => {
            const sanitizer = new ImagePromptSanitizer();
            expect(sanitizer.sanitizePrompt("nsfw content")).toBe("[filtered] content");
            expect(sanitizer.sanitizePrompt("violence here")).toBe("[filtered] here");
        });

        it("should inject visual tags", () => {
            const sanitizer = new ImagePromptSanitizer();
            expect(sanitizer.injectVisualTags("a cat", ["animal", "pet"])).toBe("a cat, animal, pet");
            expect(sanitizer.injectVisualTags("a cat", [])).toBe("a cat");
        });

        it("should apply style tokens", () => {
            const sanitizer = new ImagePromptSanitizer();
            expect(sanitizer.applyStyleTokens("a cat", ["photorealistic"])).toBe("a cat, style: photorealistic");
        });

        it("should apply environmental modifiers", () => {
            const sanitizer = new ImagePromptSanitizer();
            expect(sanitizer.applyEnvironmentalModifiers("a cat", ["sunset", "outdoor"])).toBe("a cat, sunset, outdoor");
        });

        it("should compile prompt", () => {
            const sanitizer = new ImagePromptSanitizer();
            const result = sanitizer.compilePrompt({
                basePrompt: "a cat",
                negativePrompt: "blurry",
                visualTags: ["animal"],
                styleTokens: ["photorealistic"],
                environmentalModifiers: ["outdoor"]
            });
            expect(result.prompt).toContain("a cat");
            expect(result.prompt).toContain("animal");
            expect(result.prompt).toContain("photorealistic");
            expect(result.negativePrompt).toBe("blurry");
        });
    });
});
