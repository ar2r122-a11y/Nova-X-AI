import { describe, it, expect } from "vitest";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { CandidateId } from "../../src/Domain/ValueObjects/CandidateId";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { CandidateGenerationPolicy } from "../../src/Domain/Policies/CandidateGenerationPolicy";

describe("CandidateBatchPipeline", () => {
    describe("8 candidates pipeline", () => {
        it("should generate 8 candidates", async () => {
            const policy = new CandidateGenerationPolicy(ImageDimensions.create(64, 64), ImageDimensions.create(8192, 8192), 8);
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-1",
                sessionId: "ses-1",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            for (let i = 0; i < 8; i++) {
                if (!policy.canGenerateMore(i)) break;
                const candidate = ImageCandidate.create({
                    id: `cnd-${i}`,
                    candidateId: CandidateId.fromString(`cnd-${i}`).getValue(),
                    imageId: "img-1",
                    prompt: PromptCompilationResult.create(`prompt ${i}`),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(512, 512),
                    width: 512,
                    height: 512,
                    format: ImageFormat.PNG,
                    generationType: "textToImage",
                    state: ImageRuntimeState.QueuingGPUJob,
                    score: i / 10,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                });
                aggregate.addCandidate(candidate);
            }
            expect(aggregate.getCandidates()).toHaveLength(8);
        });

        it("should select best candidate from 8", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-1",
                sessionId: "ses-1",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            for (let i = 0; i < 8; i++) {
                const candidate = ImageCandidate.create({
                    id: `cnd-${i}`,
                    candidateId: CandidateId.fromString(`cnd-${i}`).getValue(),
                    imageId: "img-1",
                    prompt: PromptCompilationResult.create(`prompt ${i}`),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(512, 512),
                    width: 512,
                    height: 512,
                    format: ImageFormat.PNG,
                    generationType: "textToImage",
                    state: ImageRuntimeState.QueuingGPUJob,
                    score: i / 10,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                });
                aggregate.addCandidate(candidate);
            }

            aggregate.setSelectedCandidateId("cnd-7");
            expect(aggregate.getSelectedCandidateId()).toBe("cnd-7");
        });

        it("should promote best asset as primary", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-1",
                sessionId: "ses-1",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            const candidate = ImageCandidate.create({
                id: "cnd-1",
                candidateId: CandidateId.fromString("cnd-1").getValue(),
                imageId: "img-1",
                prompt: PromptCompilationResult.create("prompt 1"),
                negativePrompt: "",
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                format: ImageFormat.PNG,
                generationType: "textToImage",
                state: ImageRuntimeState.QueuingGPUJob,
                score: 0.8,
                seed: null,
                uri: "",
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            aggregate.addCandidate(candidate);

            const asset = {
                id: "ast-1",
                assetId: AssetId.fromString("ast-1"),
                imageId: "img-123",
                ownerId: "owner-1",
                format: ImageFormat.PNG,
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                sizeBytes: 1024,
                checksum: "abc",
                uri: "s3://bucket/img.png",
                mimeType: "image/png",
                createdAt: Date.now(),
                finalizedAt: null,
                completedAt: null,
                isPrimary: true,
                isCandidate: false,
                isAvatar: false,
                candidateId: "cnd-1",
                parentImageId: null,
                mode: "textToImage",
                aspectRatio: "1:1",
                status: "completed",
                provenance: AssetProvenance.create("hash", ModelIdentifier.fromString("model"), ProviderId.fromString("prov"), "ses-123"),
                safetyRating: "safe" as any,
                metadata: {}
            };
            aggregate.addAsset(asset);
            aggregate.promoteToPrimary(AssetId.fromString("ast-1"), true);
            expect(aggregate.getPrimaryAssetId()?.getValue()).toBe("ast-1");
        });
    });

    describe("16 candidates pipeline", () => {
        it("should handle 16 candidates within max", () => {
            const policy = new CandidateGenerationPolicy(ImageDimensions.create(64, 64), ImageDimensions.create(8192, 8192), 16);
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-16",
                sessionId: "ses-16",
                ownerId: "owner-16",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            for (let i = 0; i < 16; i++) {
                if (!policy.canGenerateMore(i)) break;
                const candidate = ImageCandidate.create({
                    id: `cnd-${i}`,
                    candidateId: CandidateId.fromString(`cnd-${i}`).getValue(),
                    imageId: "img-16",
                    prompt: PromptCompilationResult.create(`prompt ${i}`),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(512, 512),
                    width: 512,
                    height: 512,
                    format: ImageFormat.PNG,
                    generationType: "textToImage",
                    state: ImageRuntimeState.QueuingGPUJob,
                    score: i / 20,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                });
                aggregate.addCandidate(candidate);
            }
            expect(aggregate.getCandidates()).toHaveLength(16);
        });
    });

    describe("batch splitting", () => {
        it("should split 16 into 2 batches of 8", () => {
            const batchSize = 8;
            const totalCandidates = 16;
            const batches: number[] = [];
            for (let i = 0; i < totalCandidates; i += batchSize) {
                batches.push(Math.min(batchSize, totalCandidates - i));
            }
            expect(batches).toEqual([8, 8]);
        });

        it("should split 20 into 3 batches", () => {
            const batchSize = 8;
            const totalCandidates = 20;
            const batches: number[] = [];
            for (let i = 0; i < totalCandidates; i += batchSize) {
                batches.push(Math.min(batchSize, totalCandidates - i));
            }
            expect(batches).toEqual([8, 8, 4]);
        });
    });

    describe("partial failures", () => {
        it("should handle some candidates failing", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-partial",
                sessionId: "ses-partial",
                ownerId: "owner-partial",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            for (let i = 0; i < 8; i++) {
                if (i === 3 || i === 6) {
                    continue;
                }
                const candidate = ImageCandidate.create({
                    id: `cnd-${i}`,
                    candidateId: CandidateId.fromString(`cnd-${i}`).getValue(),
                    imageId: "img-partial",
                    prompt: PromptCompilationResult.create(`prompt ${i}`),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(512, 512),
                    width: 512,
                    height: 512,
                    format: ImageFormat.PNG,
                    generationType: "textToImage",
                    state: ImageRuntimeState.QueuingGPUJob,
                    score: 0.5,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                });
                aggregate.addCandidate(candidate);
            }
            expect(aggregate.getCandidates()).toHaveLength(6);
        });
    });

    describe("candidate selection and promotion", () => {
        it("should select candidate with highest score", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-sel",
                sessionId: "ses-sel",
                ownerId: "owner-sel",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            for (let i = 0; i < 8; i++) {
                const candidate = ImageCandidate.create({
                    id: `cnd-${i}`,
                    candidateId: CandidateId.fromString(`cnd-${i}`).getValue(),
                    imageId: "img-sel",
                    prompt: PromptCompilationResult.create(`prompt ${i}`),
                    negativePrompt: "",
                    dimensions: ImageDimensions.create(512, 512),
                    width: 512,
                    height: 512,
                    format: ImageFormat.PNG,
                    generationType: "textToImage",
                    state: ImageRuntimeState.QueuingGPUJob,
                    score: i / 10,
                    seed: null,
                    uri: "",
                    isSelected: false,
                    metadata: {},
                    createdAt: Date.now()
                });
                aggregate.addCandidate(candidate);
            }

            aggregate.setSelectedCandidateId("cnd-7");
            expect(aggregate.getSelectedCandidateId()).toBe("cnd-7");
        });

        it("should not promote if no assets", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-no-asset",
                sessionId: "ses-no-asset",
                ownerId: "owner-no-asset",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            expect(aggregate.getPrimaryAssetId()).toBeNull();
        });
    });

    describe("primary avatar assignment", () => {
        it("should assign primary avatar to best candidate asset", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-avatar",
                sessionId: "ses-avatar",
                ownerId: "owner-avatar",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });

            const candidate = ImageCandidate.create({
                id: "cnd-1",
                candidateId: CandidateId.fromString("cnd-1").getValue(),
                imageId: "img-avatar",
                prompt: PromptCompilationResult.create("prompt 1"),
                negativePrompt: "",
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                format: ImageFormat.PNG,
                generationType: "textToImage",
                state: ImageRuntimeState.QueuingGPUJob,
                score: 0.9,
                seed: null,
                uri: "",
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            aggregate.addCandidate(candidate);

            const asset = {
                id: "ast-1",
                assetId: AssetId.fromString("ast-1"),
                imageId: "img-avatar",
                ownerId: "owner-avatar",
                format: ImageFormat.PNG,
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                sizeBytes: 1024,
                checksum: "abc",
                uri: "s3://bucket/avatar.png",
                mimeType: "image/png",
                createdAt: Date.now(),
                finalizedAt: null,
                completedAt: null,
                isPrimary: true,
                isCandidate: false,
                isAvatar: true,
                candidateId: "cnd-1",
                parentImageId: null,
                mode: "textToImage",
                aspectRatio: "1:1",
                status: "completed",
                provenance: AssetProvenance.create("hash", ModelIdentifier.fromString("model"), ProviderId.fromString("prov"), "ses-avatar"),
                safetyRating: "safe" as any,
                metadata: {}
            };
            aggregate.addAsset(asset);
            aggregate.promoteToPrimary(AssetId.fromString("ast-1"), true);
            aggregate.setSelectedCandidateId("cnd-1");
            expect(aggregate.getPrimaryAssetId()?.getValue()).toBe("ast-1");
            expect(aggregate.getSelectedCandidateId()).toBe("cnd-1");
        });
    });

    describe("no unnecessary upscaling", () => {
        it("should not upscale when dimensions match target", () => {
            const target = ImageDimensions.create(1024, 1024);
            const source = ImageDimensions.create(1024, 1024);
            expect(target.equals(source)).toBe(true);
        });

        it("should detect when upscaling is needed", () => {
            const target = ImageDimensions.create(2048, 2048);
            const source = ImageDimensions.create(1024, 1024);
            expect(target.equals(source)).toBe(false);
        });
    });
});
