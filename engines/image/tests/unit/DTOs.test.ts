import { describe, it, expect } from "vitest";
import { ImageSummaryDto } from "../../src/Application/DTO/ImageSummaryDto";
import { CandidateDto } from "../../src/Application/DTO/CandidateDto";
import { GenerationOptionsDto } from "../../src/Application/DTO/GenerationOptionsDto";
import { RenderJobDto } from "../../src/Application/DTO/RenderJobDto";

describe("DTOs", () => {
    it("ImageSummaryDto should hold summary data", () => {
        const dto = new ImageSummaryDto("img-123", "ses-123", "owner-123", "textToImage", "draft", null, 4, Date.now());
        expect(dto.imageId).toBe("img-123");
        expect(dto.sessionId).toBe("ses-123");
        expect(dto.ownerId).toBe("owner-123");
        expect(dto.mode).toBe("textToImage");
        expect(dto.status).toBe("draft");
        expect(dto.selectedCandidateId).toBeNull();
        expect(dto.candidateCount).toBe(4);
        expect(dto.createdAt).toBeGreaterThan(0);
    });

    it("CandidateDto should hold candidate data", () => {
        const dto = new CandidateDto("cnd-123", "img-1", "uri", "prompt", "neg", 512, 768, 123, 0.95, false, {}, Date.now());
        expect(dto.candidateId).toBe("cnd-123");
        expect(dto.imageId).toBe("img-1");
        expect(dto.uri).toBe("uri");
        expect(dto.prompt).toBe("prompt");
        expect(dto.negativePrompt).toBe("neg");
        expect(dto.width).toBe(512);
        expect(dto.height).toBe(768);
        expect(dto.seed).toBe(123);
        expect(dto.score).toBe(0.95);
        expect(dto.isSelected).toBe(false);
        expect(dto.metadata).toEqual({});
    });

    it("CandidateDto.fromEntity should create from entity", () => {
        const entity = {
            candidateId: { getValue: () => "cnd-1" },
            imageId: "img-1",
            uri: "uri",
            prompt: "prompt",
            negativePrompt: "neg",
            width: 512,
            height: 768,
            seed: 123,
            score: 0.8,
            isSelected: false,
            metadata: {},
            createdAt: Date.now()
        };
        const dto = CandidateDto.fromEntity(entity as any);
        expect(dto.candidateId).toBe("cnd-1");
        expect(dto.prompt).toBe("prompt");
        expect(dto.score).toBe(0.8);
    });

    it("GenerationOptionsDto should hold generation options", () => {
        const dto = new GenerationOptionsDto(1024, 768, 20, 7, 123, ["128", "256"]);
        expect(dto.width).toBe(1024);
        expect(dto.height).toBe(768);
        expect(dto.steps).toBe(20);
        expect(dto.cfgScale).toBe(7);
        expect(dto.seed).toBe(123);
        expect(dto.thumbnailSizes).toEqual(["128", "256"]);
    });

    it("RenderJobDto should hold render job data", () => {
        const dto = new RenderJobDto("ren-1", "img-1", "provider-1", "queued", 1, 0, 3, null, null, null, null, Date.now());
        expect(dto.jobId).toBe("ren-1");
        expect(dto.imageId).toBe("img-1");
        expect(dto.providerId).toBe("provider-1");
        expect(dto.status).toBe("queued");
        expect(dto.priority).toBe(1);
        expect(dto.attempts).toBe(0);
        expect(dto.maxAttempts).toBe(3);
    });

    it("DTOs should have readonly properties", () => {
        const dto = new ImageSummaryDto("img-1", "ses-1", "owner-1", "textToImage", "draft", null, 1, Date.now());
        expect(Object.isFrozen(dto)).toBe(false);
    });
});
