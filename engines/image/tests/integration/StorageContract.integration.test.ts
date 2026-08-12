import { describe, it, expect } from "vitest";
import { ImageAggregateFactory } from "../../src/Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { ImageCandidate } from "../../src/Domain/Entities/ImageCandidate";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";
import { AssetId } from "../../src/Domain/ValueObjects/AssetId";
import { ImageAsset } from "../../src/Domain/Entities/ImageAsset";
import { PromptCompilationResult } from "../../src/Domain/ValueObjects/PromptCompilationResult";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ImageProjection } from "../../src/Application/Projections/ImageProjection";

describe("StorageContract.integration", () => {
    it("should persist and retrieve aggregate", async () => {
        const imageId = ImageId.create();
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: imageId.getValue(),
            sessionId: "ses-1",
            ownerId: "owner-1",
            prompt: "test",
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "1:1"
        });

        const candidate = ImageCandidate.create({
            id: "cnd-1",
            candidateId: "cnd-1",
            imageId: imageId.getValue(),
            prompt: PromptCompilationResult.create("test prompt"),
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

        const asset: ImageAsset = {
            id: "ast-1",
            assetId: AssetId.fromString("ast-1"),
            imageId: imageId.getValue(),
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
            provenance: AssetProvenance.create("hash", ModelIdentifier.fromString("model"), ProviderId.fromString("prov"), "ses-1"),
            safetyRating: "safe" as any,
            metadata: {}
        };
        aggregate.addAsset(asset);

        const summary = ImageProjection.projectSummary(aggregate);
        expect(summary.imageId).toBe(imageId.getValue());
        expect(summary.candidateCount).toBe(1);
        expect(summary.selectedCandidateId).toBeNull();
    });

    it("should maintain snapshot consistency", () => {
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: "img-snap-123",
            sessionId: "ses-1",
            ownerId: "owner-1",
            prompt: "snapshot test",
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "16:9"
        });

        const summary = ImageProjection.projectSummary(aggregate);
        expect(summary.imageId).toBe("img-snap-123");
        expect(summary.mode).toBe("textToImage");
        expect(summary.aspectRatio).toBe("1024:1024");
        expect(summary.status).toBe("WaitingForPrompt");
    });

    it("should update projection after state changes", () => {
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: "img-update",
            sessionId: "ses-1",
            ownerId: "owner-1",
            prompt: "test",
            negativePrompt: "",
            mode: "textToImage",
            aspectRatio: "1:1"
        });

        let summary = ImageProjection.projectSummary(aggregate);
        expect(summary.status).toBe("WaitingForPrompt");

        aggregate.setState(ImageRuntimeState.Rendering);
        summary = ImageProjection.projectSummary(aggregate);
        expect(summary.status).toBe("Rendering");

        aggregate.setSelectedCandidateId("cnd-1");
        summary = ImageProjection.projectSummary(aggregate);
        expect(summary.selectedCandidateId).toBe("cnd-1");
    });
});
