import { describe, it, expect } from "vitest";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { CorrelationMetadata } from "../../src/Domain/ValueObjects/CorrelationMetadata";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { ImageAsset } from "../../src/Domain/Entities/ImageAsset";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { FakeImageProviderAdapter } from "../../src/Infrastructure/Adapters/FakeImageProviderAdapter";
import { ImagePromptOrchestrator } from "../../src/Domain/Services/ImageEngineServices";

describe("CharacterImageContract.integration", () => {
    it("should pass character candidate to image engine", async () => {
        const characterId = "char-123";
        const imageId = ImageId.create();
        const correlation = CorrelationMetadata.generate();
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: imageId.getValue(),
            sessionId: correlation.getSessionId(),
            ownerId: "owner-1",
            prompt: `hero ${characterId} portrait`,
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "1:1"
        });

        const orchestrator = new ImagePromptOrchestrator();
        const prompt = orchestrator.compilePrompt({ originalPrompt: `hero ${characterId} portrait` });

        const candidate = ImageCandidate.create({
            id: "cnd-1",
            candidateId: "cnd-1",
            imageId: imageId.getValue(),
            prompt: PromptCompilationResult.create(prompt.getCompiledPrompt()),
            negativePrompt: "",
            dimensions: ImageDimensions.create(512, 768),
            width: 512,
            height: 768,
            format: ImageFormat.PNG,
            generationType: "textToImage",
            state: ImageRuntimeState.Rendering,
            score: 0.9,
            seed: null,
            uri: "",
            isSelected: false,
            metadata: {},
            createdAt: Date.now()
        });
        aggregate.addCandidate(candidate);

        const provider = new FakeImageProviderAdapter();
        await provider.executeGeneration({
            imageId: imageId.getValue(),
            prompt: prompt.getCompiledPrompt(),
            negativePrompt: "",
            mode: "textToImage",
            width: 512,
            height: 768,
            candidateCount: 1,
            seed: 123
        });

        const asset: ImageAsset = {
            id: "ast-1",
            assetId: AssetId.fromString("ast-1"),
            imageId: imageId.getValue(),
            ownerId: "owner-1",
            format: ImageFormat.PNG,
            dimensions: ImageDimensions.create(512, 768),
            width: 512,
            height: 768,
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
            provenance: AssetProvenance.create("hash", ModelIdentifier.fromString("model"), ProviderId.fromString("prov"), "ses-123"),
            safetyRating: "safe" as any,
            metadata: {}
        };
        aggregate.addAsset(asset);

        expect(aggregate.getCandidates()).toHaveLength(1);
        expect(aggregate.getAssets()).toHaveLength(1);
        expect(aggregate.getCandidates()[0].prompt.getCompiledPrompt()).toContain("hero");
    });

    it("should create avatar candidate from character visual description", () => {
        const characterId = "char-456";
        const orchestrator = new ImagePromptOrchestrator();
        const prompt = orchestrator.compilePrompt({ originalPrompt: `avatar for ${characterId}` });
        const candidate = ImageCandidate.create({
            id: "cnd-1",
            candidateId: "cnd-1",
            imageId: "img-123",
            prompt: PromptCompilationResult.create(prompt.getCompiledPrompt()),
            negativePrompt: "",
            dimensions: ImageDimensions.create(256, 256),
            width: 256,
            height: 256,
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
        expect(candidate.prompt.getCompiledPrompt()).toContain(characterId);
        expect(candidate.dimensions.getWidth()).toBe(256);
    });

    it("should promote avatar asset as primary", () => {
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: "img-avatar",
            sessionId: "ses-avatar",
            ownerId: "owner-avatar",
            prompt: "avatar",
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "1:1"
        });

        const candidate = ImageCandidate.create({
            id: "cnd-1",
            candidateId: "cnd-1",
            imageId: "img-avatar",
            prompt: PromptCompilationResult.create("avatar"),
            negativePrompt: "",
            dimensions: ImageDimensions.create(256, 256),
            width: 256,
            height: 256,
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

        const asset: ImageAsset = {
            id: "ast-1",
            assetId: AssetId.fromString("ast-1"),
            imageId: "img-avatar",
            ownerId: "owner-avatar",
            format: ImageFormat.PNG,
            dimensions: ImageDimensions.create(256, 256),
            width: 256,
            height: 256,
            sizeBytes: 512,
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
        expect(aggregate.getPrimaryAssetId()?.getValue()).toBe("ast-1");
    });
});
