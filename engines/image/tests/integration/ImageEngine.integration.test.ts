import { describe, it, expect } from "vitest";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { CorrelationMetadata } from "../../src/Domain/ValueObjects/CorrelationMetadata";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { ImageAsset } from "../../src/Domain/Entities/ImageAsset";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";
import { FakeImageProviderAdapter } from "../../src/Infrastructure/Adapters/FakeImageProviderAdapter";
import { ImagePromptOrchestrator } from "../../src/Domain/Services/ImageEngineServices";
import { CandidateGenerationPolicy } from "../../src/Domain/Policies/CandidateGenerationPolicy";
import { SafetyContentModerationPolicy } from "../../src/Domain/Policies/SafetyContentModerationPolicy";
import { ContentSafetyRating } from "../../src/Domain/ValueObjects/ContentSafetyRating";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";

describe("ImageEngine.integration", () => {
    it("should complete full engine lifecycle with fake provider", async () => {
        const imageId = ImageId.create();
        const correlation = CorrelationMetadata.generate();
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: imageId.getValue(),
            sessionId: correlation.getSessionId(),
            ownerId: "owner-1",
            prompt: "a beautiful sunset",
            negativePrompt: "blurry",
            mode: "textToImage",
            aspectRatio: "16:9"
        });

        const provider = new FakeImageProviderAdapter();
        const orchestrator = new ImagePromptOrchestrator();

        const promptResult = orchestrator.compilePrompt({ originalPrompt: "a beautiful sunset" });
        expect(promptResult.getCompiledPrompt()).toContain("a beautiful sunset");

        const candidate = ImageCandidate.create({
            id: "cnd-1",
            candidateId: "cnd-1",
            imageId: imageId.getValue(),
            prompt: PromptCompilationResult.create(promptResult.getCompiledPrompt()),
            negativePrompt: "",
            dimensions: ImageDimensions.create(1024, 768),
            width: 1024,
            height: 768,
            format: ImageFormat.PNG,
            generationType: "textToImage",
            state: ImageRuntimeState.Rendering,
            score: 0.95,
            seed: null,
            uri: "",
            isSelected: false,
            metadata: {},
            createdAt: Date.now()
        });
        aggregate.addCandidate(candidate);

        const result = await provider.executeGeneration({
            imageId: imageId.getValue(),
            prompt: promptResult.getCompiledPrompt(),
            negativePrompt: "blurry",
            mode: "textToImage",
            width: 1024,
            height: 768,
            candidateCount: 1,
            seed: 123
        });
        expect(result.success).toBe(true);
        expect(result.candidates).toHaveLength(1);
        expect(result.providerId).toBe("fake-provider");

        const asset: ImageAsset = {
            id: "ast-1",
            assetId: AssetId.fromString("ast-1"),
            imageId: imageId.getValue(),
            ownerId: "owner-1",
            format: ImageFormat.PNG,
            dimensions: ImageDimensions.create(512, 512),
            width: 512,
            height: 512,
            sizeBytes: 2048,
            checksum: "abc",
            uri: result.candidates[0].uri,
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
        aggregate.setSelectedCandidateId("cnd-1");
        aggregate.promoteToPrimary(AssetId.fromString("ast-1"), true);
        aggregate.setState(ImageRuntimeState.Completed);

        expect(aggregate.getCandidates()).toHaveLength(1);
        expect(aggregate.getAssets()).toHaveLength(1);
        expect(aggregate.getSelectedCandidateId()).not.toBeNull();
        expect(aggregate.getPrimaryAssetId()).not.toBeNull();
    });

    it("should handle provider failure gracefully", async () => {
        const provider = new FakeImageProviderAdapter();
        provider.setAvailable(false);
        const result = await provider.isAvailable();
        expect(result).toBe(false);
    });

    it("should enforce safety policy", () => {
        const policy = new SafetyContentModerationPolicy(["nsfw", "gore"]);
        expect(() => policy.moderate(ContentSafetyRating.UNSAFE, [])).toThrow();
    });

    it("should generate candidates up to policy limit", () => {
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

        for (let i = 0; i < 10; i++) {
            if (!policy.canGenerateMore(i)) break;
            const candidate = ImageCandidate.create({
                id: `cnd-${i}`,
                candidateId: `cnd-${i}`,
                imageId: "img-1",
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
        expect(aggregate.getCandidates()).toHaveLength(8);
    });
});
