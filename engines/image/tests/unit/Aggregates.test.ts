import { describe, it, expect } from "vitest";
import { ImageAggregate } from "../../src/Domain/Aggregates/ImageAggregate";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageAsset } from "../../src/Domain/Entities/ImageAsset";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";

describe("Aggregates", () => {
    describe("ImageAggregate", () => {
        it("should create from template", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            expect(aggregate.getId().getValue()).toBe("img-123");
            expect(aggregate.getSessionId().getValue()).toBe("ses-123");
            expect(aggregate.getState()).toBe(ImageRuntimeState.WaitingForPrompt);
            expect(aggregate.getPrompt()).toBe("test");
            expect(aggregate.getCandidates()).toHaveLength(0);
            expect(aggregate.getAssets()).toHaveLength(0);
            expect(aggregate.getError()).toBeNull();
        });

        it("should compile prompt", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const result = aggregate.compilePrompt("a beautiful sunset", [], [], []);
            expect(result.getCompiledPrompt()).toBe("a beautiful sunset");
            expect(aggregate.getState()).toBe(ImageRuntimeState.PromptOrchestration);
            expect(aggregate.getPrompt()).toBe("a beautiful sunset");
        });

        it("should add candidate", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const candidate = ImageCandidate.create({
                id: "cnd-1",
                candidateId: "cnd-1",
                imageId: "img-123",
                prompt: PromptCompilationResult.create("prompt"),
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
            expect(aggregate.getCandidates()).toHaveLength(1);
        });

        it("should add asset", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const asset: ImageAsset = {
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
            expect(aggregate.getAssets()).toHaveLength(1);
        });

        it("should select candidate", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const candidate = ImageCandidate.create({
                id: "cnd-1",
                candidateId: "cnd-1",
                imageId: "img-123",
                prompt: PromptCompilationResult.create("prompt"),
                negativePrompt: "",
                dimensions: ImageDimensions.create(512, 512),
                width: 512,
                height: 512,
                format: ImageFormat.PNG,
                generationType: "textToImage",
                state: ImageRuntimeState.Idle,
                score: 0.9,
                seed: null,
                uri: "",
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            aggregate.addCandidate(candidate);
            aggregate.selectCandidate("cnd-1");
            expect(aggregate.getSelectedCandidateId()).toBe("cnd-1");
        });

        it("should promote asset", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const asset: ImageAsset = {
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

        it("should generate thumbnail", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            const asset: ImageAsset = {
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
            const thumbnail = aggregate.generateThumbnail(AssetId.fromString("ast-1"), 256);
            expect(thumbnail.size).toBe(256);
        });

        it("should recover from failure", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            aggregate.setState(ImageRuntimeState.Failed);
            aggregate.recover();
            expect(aggregate.getState()).toBe(ImageRuntimeState.Recovering);
            expect(aggregate.getError()).toBeNull();
        });

        it("should fail rendering", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            aggregate.compilePrompt("test", [], [], []);
            aggregate.queueRender();
            aggregate.startRendering();
            aggregate.failRendering("provider error");
            expect(aggregate.getState()).toBe(ImageRuntimeState.Failed);
            expect(aggregate.getError()).toBe("provider error");
        });

        it("should emit events", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            aggregate.compilePrompt("test", [], [], []);
            expect(aggregate.getUncommittedEvents().length).toBeGreaterThan(0);
            aggregate.commitEvents();
            expect(aggregate.getUncommittedEvents().length).toBe(0);
        });

        it("should snapshot and restore", () => {
            const aggregate = ImageAggregateFactory.createFromTemplate({
                imageId: "img-123",
                sessionId: "ses-123",
                ownerId: "owner-1",
                prompt: "test",
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1"
            });
            aggregate.compilePrompt("test", [], [], []);
            const snapshot = aggregate.getSnapshot();
            const restored = ImageAggregate.fromSnapshot(snapshot);
            expect(restored.getId().getValue()).toBe("img-123");
            expect(restored.getState()).toBe(ImageRuntimeState.PromptOrchestration);
        });
    });
});
