import { describe, it, expect } from "vitest";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageAsset } from "../../src/Domain/Entities/ImageAsset";
import { RenderJob } from "../../src/Domain/Entities/RenderJob";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { RenderId } from "../../src/Domain/ValueObjects/RenderId";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { GenerationType } from "../../src/Domain/ValueObjects/GenerationType";

describe("Entities", () => {
    describe("ImageCandidate", () => {
        it("should create from props", () => {
            const candidate = ImageCandidate.create({
                id: "cnd-123",
                candidateId: "cnd-123",
                imageId: "img-123",
                prompt: PromptCompilationResult.create("a cat"),
                negativePrompt: "",
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                format: ImageFormat.PNG,
                generationType: GenerationType.TEXT_TO_IMAGE,
                state: ImageRuntimeState.Rendering,
                score: 0.95,
                seed: null,
                uri: "",
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            expect(candidate.candidateId).toBe("cnd-123");
            expect(candidate.prompt.getCompiledPrompt()).toBe("a cat");
            expect(candidate.dimensions.getWidth()).toBe(512);
            expect(candidate.format).toBe(ImageFormat.PNG);
            expect(candidate.state).toBe(ImageRuntimeState.Rendering);
            expect(candidate.score).toBe(0.95);
        });

        it("should allow state changes", () => {
            const candidate = ImageCandidate.create({
                id: "cnd-123",
                candidateId: "cnd-123",
                imageId: "img-123",
                prompt: PromptCompilationResult.create("test"),
                negativePrompt: "",
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                format: ImageFormat.PNG,
                generationType: GenerationType.TEXT_TO_IMAGE,
                state: ImageRuntimeState.QueuingGPUJob,
                score: 0.5,
                seed: null,
                uri: "",
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            const mutableCandidate = candidate as any;
            mutableCandidate.state = ImageRuntimeState.Rendering;
            expect(mutableCandidate.state).toBe(ImageRuntimeState.Rendering);
        });
    });

    describe("ImageAsset", () => {
        it("should create from props", () => {
            const asset: ImageAsset = {
                id: "ast-123",
                assetId: AssetId.fromString("ast-123"),
                imageId: "img-123",
                ownerId: "owner-1",
                format: ImageFormat.PNG,
                dimensions: ImageDimensions.create(1024, 768),
                width: 1024,
                height: 768,
                sizeBytes: 2048,
                checksum: "abc",
                uri: "s3://bucket/image.png",
                mimeType: "image/png",
                createdAt: Date.now(),
                finalizedAt: null,
                completedAt: null,
                isPrimary: true,
                isCandidate: false,
                isAvatar: false,
                candidateId: "cnd-123",
                parentImageId: null,
                mode: "textToImage",
                aspectRatio: "1:1",
                status: "completed",
                provenance: {} as any,
                safetyRating: "safe" as any,
                metadata: {}
            };
            expect(asset.assetId.getValue()).toBe("ast-123");
            expect(asset.uri).toBe("s3://bucket/image.png");
            expect(asset.mimeType).toBe("image/png");
            expect(asset.width).toBe(1024);
            expect(asset.height).toBe(768);
            expect(asset.sizeBytes).toBe(2048);
            expect(asset.isPrimary).toBe(true);
            expect(asset.isAvatar).toBe(false);
            expect(asset.candidateId).toBe("cnd-123");
        });
    });

    describe("RenderJob", () => {
        it("should create from props", () => {
            const job: RenderJob = {
                id: "ren-123",
                jobId: RenderId.fromString("ren-123"),
                imageId: ImageId.fromString("img-123"),
                state: ImageRuntimeState.QueuingGPUJob,
                status: "queued",
                providerId: "provider-1",
                modelId: "model-1",
                dimensions: ImageDimensions.create(1024, 768),
                prompt: "test",
                style: "realistic",
                generationType: GenerationType.TEXT_TO_IMAGE,
                priority: 1,
                attempts: 0,
                maxAttempts: 3,
                resultAssetId: null,
                startedAt: null,
                completedAt: null,
                failedAt: null,
                createdAt: Date.now(),
                errorMessage: null,
                resourceBudget: {} as any,
                streamChunks: []
            };
            expect(job.jobId.getValue()).toBe("ren-123");
            expect(job.providerId).toBe("provider-1");
            expect(job.status).toBe("queued");
            expect(job.priority).toBe(1);
            expect(job.attempts).toBe(0);
            expect(job.startedAt).toBeNull();
            expect(job.completedAt).toBeNull();
        });

        it("should update job state", () => {
            const job: any = {
                id: "ren-123",
                jobId: RenderId.fromString("ren-123"),
                imageId: ImageId.fromString("img-123"),
                state: ImageRuntimeState.QueuingGPUJob,
                status: "queued",
                providerId: "provider-1",
                modelId: "model-1",
                dimensions: ImageDimensions.create(1024, 768),
                prompt: "test",
                style: "realistic",
                generationType: GenerationType.TEXT_TO_IMAGE,
                priority: 1,
                attempts: 0,
                maxAttempts: 3,
                resultAssetId: null,
                startedAt: null,
                completedAt: null,
                failedAt: null,
                createdAt: Date.now(),
                errorMessage: null,
                resourceBudget: {} as any,
                streamChunks: []
            };
            job.state = ImageRuntimeState.Rendering;
            expect(job.state).toBe(ImageRuntimeState.Rendering);
            job.startedAt = Date.now();
            expect(job.startedAt).not.toBeNull();
            job.completedAt = Date.now();
            expect(job.completedAt).not.toBeNull();
            job.attempts = 1;
            expect(job.attempts).toBe(1);
        });
    });
});
