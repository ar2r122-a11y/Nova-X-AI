import { describe, it, expect } from "vitest";
import {
    ImageId,
    RenderId,
    AssetId,
    CandidateId,
    ImageDimensions,
    ImageStatus,
    GenerationMode,
    AspectRatio,
    ResourceBudget,
    ImageRuntimeState,
    ImageRuntimeStateTransitions,
    GenerationType,
    ThumbnailSize,
    ImageFormat,
    ContentSafetyRating,
    AssetProvenance,
    PromptCompilationResult,
    CorrelationMetadata,
    ModelIdentifier,
    ProviderId,
    SessionId,
    StyleIdentifier,
    ImageStyle
} from "../../src/Domain/ValueObjects";

describe("ValueObjects", () => {
    describe("ImageId", () => {
        it("should create unique IDs", () => {
            const id1 = ImageId.create();
            const id2 = ImageId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^img-/);
        });

        it("should support fromString", () => {
            const id = ImageId.fromString("img-123");
            expect(id.getValue()).toBe("img-123");
        });

        it("should support equality", () => {
            const id1 = ImageId.fromString("img-123");
            const id2 = ImageId.fromString("img-123");
            const id3 = ImageId.fromString("img-456");
            expect(id1.equals(id2)).toBe(true);
            expect(id1.equals(id3)).toBe(false);
        });

        it("should reject empty string", () => {
            expect(() => ImageId.fromString("")).toThrow();
            expect(() => ImageId.fromString("   ")).toThrow();
        });
    });

    describe("RenderId", () => {
        it("should create unique IDs", () => {
            const id1 = RenderId.create();
            const id2 = RenderId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^ren-/);
        });

        it("should support equality", () => {
            const id1 = RenderId.fromString("ren-123");
            const id2 = RenderId.fromString("ren-123");
            expect(id1.equals(id2)).toBe(true);
        });
    });

    describe("AssetId", () => {
        it("should create unique IDs", () => {
            const id1 = AssetId.create();
            const id2 = AssetId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^ast-/);
        });

        it("should support equality", () => {
            const id1 = AssetId.fromString("ast-123");
            const id2 = AssetId.fromString("ast-123");
            expect(id1.equals(id2)).toBe(true);
        });
    });

    describe("CandidateId", () => {
        it("should create unique IDs", () => {
            const id1 = CandidateId.create();
            const id2 = CandidateId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^cnd-/);
        });

        it("should support equality", () => {
            const id1 = CandidateId.fromString("cnd-123");
            const id2 = CandidateId.fromString("cnd-123");
            expect(id1.equals(id2)).toBe(true);
        });
    });

    describe("ImageDimensions", () => {
        it("should create valid dimensions", () => {
            const dim = ImageDimensions.create(1024, 768);
            expect(dim.getWidth()).toBe(1024);
            expect(dim.getHeight()).toBe(768);
            expect(dim.getAspectRatio()).toBeCloseTo(1024 / 768);
        });

        it("should parse from string", () => {
            const dim = ImageDimensions.fromString("512x512");
            expect(dim.getWidth()).toBe(512);
            expect(dim.getHeight()).toBe(512);
            expect(dim.toString()).toBe("512x512");
        });

        it("should reject invalid dimensions", () => {
            expect(() => ImageDimensions.create(0, 100)).toThrow();
            expect(() => ImageDimensions.create(100, 0)).toThrow();
            expect(() => ImageDimensions.create(-1, 100)).toThrow();
            expect(() => ImageDimensions.create(100.5, 100)).toThrow();
            expect(() => ImageDimensions.fromString("invalid")).toThrow();
        });

        it("should support equality", () => {
            const d1 = ImageDimensions.create(100, 100);
            const d2 = ImageDimensions.create(100, 100);
            const d3 = ImageDimensions.create(200, 200);
            expect(d1.equals(d2)).toBe(true);
            expect(d1.equals(d3)).toBe(false);
        });
    });

    describe("ImageStatus", () => {
        it("should create valid statuses", () => {
            expect(ImageStatus.create("draft").getValue()).toBe("draft");
            expect(ImageStatus.create("queued").getValue()).toBe("queued");
            expect(ImageStatus.create("rendering").getValue()).toBe("rendering");
            expect(ImageStatus.create("completed").getValue()).toBe("completed");
            expect(ImageStatus.create("failed").getValue()).toBe("failed");
            expect(ImageStatus.create("cancelled").getValue()).toBe("cancelled");
        });

        it("should reject invalid status", () => {
            expect(() => ImageStatus.create("invalid")).toThrow();
        });
    });

    describe("GenerationMode", () => {
        it("should create valid modes", () => {
            expect(GenerationMode.create("textToImage").getValue()).toBe("textToImage");
            expect(GenerationMode.create("imageToImage").getValue()).toBe("imageToImage");
            expect(GenerationMode.create("inpainting").getValue()).toBe("inpainting");
        });

        it("should reject invalid mode", () => {
            expect(() => GenerationMode.create("invalid")).toThrow();
        });
    });

    describe("AspectRatio", () => {
        it("should create valid ratio", () => {
            const ratio = AspectRatio.create(16, 9);
            expect(ratio.getWidth()).toBe(16);
            expect(ratio.getHeight()).toBe(9);
            expect(ratio.getRatio()).toBeCloseTo(16 / 9);
        });

        it("should parse from string", () => {
            const ratio = AspectRatio.fromString("16:9");
            expect(ratio.getWidth()).toBe(16);
            expect(ratio.getHeight()).toBe(9);
            expect(ratio.toString()).toBe("16:9");
        });

        it("should reject invalid ratio", () => {
            expect(() => AspectRatio.create(0, 9)).toThrow();
            expect(() => AspectRatio.fromString("invalid")).toThrow();
        });
    });

    describe("ResourceBudget", () => {
        it("should create valid budget", () => {
            const budget = ResourceBudget.create(8192, 16384, 60000, 4096);
            expect(budget.getVRAMBudget()).toBe(8192);
            expect(budget.getMemoryBudget()).toBe(16384);
            expect(budget.getTimeoutMs()).toBe(60000);
            expect(budget.getMaxResolution()).toBe(4096);
            expect(budget.isExhausted()).toBe(false);
        });

        it("should reject negative values", () => {
            expect(() => ResourceBudget.create(-1, 100, 1000, 100)).toThrow();
            expect(() => ResourceBudget.create(100, -1, 1000, 100)).toThrow();
            expect(() => ResourceBudget.create(100, 100, -1, 100)).toThrow();
            expect(() => ResourceBudget.create(100, 100, 1000, -1)).toThrow();
        });

        it("should consume resources", () => {
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(300, 500, 1000);
            expect(budget.getRemainingVRAM()).toBe(700);
            expect(budget.getRemainingMemory()).toBe(1500);
            expect(budget.getRemainingTimeMs()).toBe(4000);
            expect(budget.getConsumedVRAM()).toBe(300);
            expect(budget.isExhausted()).toBe(false);
        });

        it("should detect exhaustion", () => {
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(1000, 0, 0);
            expect(budget.isExhausted()).toBe(true);
            budget.consume(0, 2000, 0);
            expect(budget.isExhausted()).toBe(true);
            budget.consume(0, 0, 5000);
            expect(budget.isExhausted()).toBe(true);
        });
    });

    describe("ImageRuntimeState", () => {
        it("should have valid states", () => {
            expect(ImageRuntimeState.Initializing).toBe("Initializing");
            expect(ImageRuntimeState.Rendering).toBe("Rendering");
            expect(ImageRuntimeState.Completed).toBe("Completed");
            expect(ImageRuntimeState.Failed).toBe("Failed");
            expect(ImageRuntimeState.Recovering).toBe("Recovering");
        });

        it("should define valid transitions", () => {
            expect(ImageRuntimeStateTransitions[ImageRuntimeState.Initializing]).toContain(ImageRuntimeState.WaitingForPrompt);
            expect(ImageRuntimeStateTransitions[ImageRuntimeState.WaitingForPrompt]).toContain(ImageRuntimeState.PromptOrchestration);
            expect(ImageRuntimeStateTransitions[ImageRuntimeState.Rendering]).toContain(ImageRuntimeState.PostProcessing);
        });
    });

    describe("GenerationType", () => {
        it("should have valid types", () => {
            expect(GenerationType.TEXT_TO_IMAGE).toBe("textToImage");
            expect(GenerationType.CANDIDATE_BATCH).toBe("candidateBatch");
            expect(GenerationType.UPSCALING).toBe("upscaling");
        });
    });

    describe("ThumbnailSize", () => {
        it("should have valid sizes", () => {
            expect(ThumbnailSize.SIZE_128).toBe(128);
            expect(ThumbnailSize.SIZE_256).toBe(256);
            expect(ThumbnailSize.SIZE_512).toBe(512);
        });
    });

    describe("ImageFormat", () => {
        it("should have valid formats", () => {
            expect(ImageFormat.WEBP).toBe("webp");
            expect(ImageFormat.PNG).toBe("png");
            expect(ImageFormat.JPEG).toBe("jpeg");
        });
    });

    describe("ContentSafetyRating", () => {
        it("should have valid ratings", () => {
            expect(ContentSafetyRating.SAFE).toBe("safe");
            expect(ContentSafetyRating.QUESTIONABLE).toBe("questionable");
            expect(ContentSafetyRating.UNSAFE).toBe("unsafe");
        });
    });

    describe("AssetProvenance", () => {
        it("should create provenance", () => {
            const provenance = AssetProvenance.create("hash123", ModelIdentifier.create("model", "v1"), ProviderId.create(), "session-1");
            expect(provenance.getPromptHash()).toBe("hash123");
            expect(provenance.getModelId().getValue()).toBe("model:v1");
            expect(provenance.getProviderId().getValue()).toMatch(/^prov-/);
            expect(provenance.getTimestamp()).toBeGreaterThan(0);
            expect(provenance.getSessionId()).toBe("session-1");
        });

        it("should create from timestamp", () => {
            const provenance = AssetProvenance.fromTimestamp(1234567890);
            expect(provenance.getTimestamp()).toBe(1234567890);
        });
    });

    describe("ModelIdentifier", () => {
        it("should create with name and version", () => {
            const model = ModelIdentifier.create("stable-diffusion", "v1.4");
            expect(model.getValue()).toBe("stable-diffusion:v1.4");
            expect(model.getModelName()).toBe("stable-diffusion");
            expect(model.getVersion()).toBe("v1.4");
        });

        it("should create without version", () => {
            const model = ModelIdentifier.create("model-name");
            expect(model.getValue()).toBe("model-name");
            expect(model.getModelName()).toBe("model-name");
            expect(model.getVersion()).toBeUndefined();
        });
    });

    describe("ProviderId", () => {
        it("should create unique IDs", () => {
            const id1 = ProviderId.create();
            const id2 = ProviderId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^prov-/);
        });
    });

    describe("SessionId", () => {
        it("should create unique IDs", () => {
            const id1 = SessionId.create();
            const id2 = SessionId.create();
            expect(id1.getValue()).not.toBe(id2.getValue());
            expect(id1.getValue()).toMatch(/^ses-/);
        });
    });

    describe("StyleIdentifier", () => {
        it("should create and compare", () => {
            const s1 = StyleIdentifier.create("photorealistic");
            const s2 = StyleIdentifier.create("photorealistic");
            const s3 = StyleIdentifier.create("anime");
            expect(s1.equals(s2)).toBe(true);
            expect(s1.equals(s3)).toBe(false);
        });
    });

    describe("ImageStyle", () => {
        it("should create valid styles", () => {
            expect(ImageStyle.create("photorealistic").getValue()).toBe("photorealistic");
            expect(ImageStyle.create("anime").getValue()).toBe("anime");
        });

        it("should have predefined constants", () => {
            expect(ImageStyle.PHOTOREALISTIC.getValue()).toBe("photorealistic");
            expect(ImageStyle.ANIME.getValue()).toBe("anime");
        });

        it("should reject invalid styles", () => {
            expect(() => ImageStyle.create("invalid")).toThrow();
        });
    });

    describe("CorrelationMetadata", () => {
        it("should create from props", () => {
            const meta = CorrelationMetadata.create({
                correlationId: "corr-1",
                requestId: "req-1",
                sessionId: "ses-1",
                traceId: "trace-1",
                spanId: "span-1",
                schemaVersion: "1.0.0"
            });
            expect(meta.getCorrelationId()).toBe("corr-1");
            expect(meta.getRequestId()).toBe("req-1");
            expect(meta.getSessionId()).toBe("ses-1");
            expect(meta.getTraceId()).toBe("trace-1");
            expect(meta.getSpanId()).toBe("span-1");
            expect(meta.getSchemaVersion()).toBe("1.0.0");
        });

        it("should generate unique values", () => {
            const meta1 = CorrelationMetadata.generate();
            const meta2 = CorrelationMetadata.generate();
            expect(meta1.getCorrelationId()).not.toBe(meta2.getCorrelationId());
            expect(meta1.getTraceId()).not.toBe(meta2.getTraceId());
            expect(meta1.getSpanId()).not.toBe(meta2.getSpanId());
        });

        it("should reject empty values", () => {
            expect(() => CorrelationMetadata.create({ correlationId: "", requestId: "r", sessionId: "s", traceId: "t", spanId: "p", schemaVersion: "1" })).toThrow();
            expect(() => CorrelationMetadata.create({ correlationId: "c", requestId: "", sessionId: "s", traceId: "t", spanId: "p", schemaVersion: "1" })).toThrow();
        });
    });

    describe("PromptCompilationResult", () => {
        it("should create result", () => {
            const result = PromptCompilationResult.create("a cat", ["nsfw"], 5, ["style"], ["cat", "animal"]);
            expect(result.getCompiledPrompt()).toBe("a cat");
            expect(result.getSafetyFlags()).toEqual(["nsfw"]);
            expect(result.getTokenCount()).toBe(5);
            expect(result.getStyleTokens()).toEqual(["style"]);
            expect(result.getVisualTags()).toEqual(["cat", "animal"]);
            expect(result.hasSafetyFlag("nsfw")).toBe(true);
            expect(result.hasSafetyFlag("safe")).toBe(false);
        });

        it("should allow empty prompt", () => {
            expect(() => PromptCompilationResult.create("")).not.toThrow();
            expect(() => PromptCompilationResult.create("   ")).not.toThrow();
        });
    });
});
