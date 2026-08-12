import { describe, it, expect } from "vitest";
import { ImageProjection } from "../../src/Application/Projections/ImageProjection";
import { ImageAggregate } from "../../src/Domain/Aggregates/ImageAggregate";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { ResourceBudget } from "../../src/Domain/ValueObjects/ResourceBudget";
import { GenerationType } from "../../src/Domain/ValueObjects/GenerationType";
import { ModelIdentifier } from "../../src/Domain/ValueObjects/ModelIdentifier";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ImageStyle } from "../../src/Domain/ValueObjects/ImageStyle";
import { AssetProvenance } from "../../src/Domain/ValueObjects/AssetProvenance";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { SessionId } from "../../src/Domain/ValueObjects/SessionId";
import { ImageRuntimeState } from "../../src/Domain/ValueObjects/ImageRuntimeState";

describe("Projections", () => {
    it("should project summary from aggregate", () => {
        const aggregate = ImageAggregate.create(
            ImageId.fromString("img-123"),
            SessionId.fromString("ses-123"),
            GenerationType.TEXT_TO_IMAGE,
            "provider-1",
            ModelIdentifier.create("model", "v1"),
            ImageDimensions.create(1024, 768),
            ImageStyle.PHOTOREALISTIC,
            ResourceBudget.create(8192, 16384, 60000, 4096),
            "test prompt",
            AssetProvenance.create("hash", ModelIdentifier.create("model", "v1"), ProviderId.create(), "ses-123")
        );

        const summary = ImageProjection.projectSummary(aggregate);
        expect(summary.imageId).toBe("img-123");
        expect(summary.sessionId).toBe("ses-123");
        expect(summary.mode).toBe("textToImage");
        expect(summary.status).toBe("Initializing");
        expect(summary.candidateCount).toBe(0);
        expect(summary.selectedCandidateId).toBeNull();
    });

    it("should update after adding candidates", () => {
        const aggregate = ImageAggregate.create(
            ImageId.fromString("img-456"),
            SessionId.fromString("ses-456"),
            GenerationType.TEXT_TO_IMAGE,
            "provider-1",
            ModelIdentifier.create("model", "v1"),
            ImageDimensions.create(1024, 768),
            ImageStyle.PHOTOREALISTIC,
            ResourceBudget.create(8192, 16384, 60000, 4096),
            "test",
            AssetProvenance.create("hash", ModelIdentifier.create("model", "v1"), ProviderId.create(), "ses-456")
        );

        const summary1 = ImageProjection.projectSummary(aggregate);
        expect(summary1.candidateCount).toBe(0);

        aggregate.setState(ImageRuntimeState.WaitingForPrompt);

        const candidate = {
            getCandidateId: () => ({ getValue: () => "cnd-1" }),
            getPrompt: () => ({ getCompiledPrompt: () => "prompt" }),
            getDimensions: () => ({ getWidth: () => 512, getHeight: () => 512 }),
            getFormat: () => ({ getValue: () => "png" }),
            getState: () => ({ getValue: () => "rendering" }),
            getScore: () => 0.9,
            getCreatedAt: () => Date.now()
        };
        aggregate.addCandidate(candidate as any);

        const summary2 = ImageProjection.projectSummary(aggregate);
        expect(summary2.candidateCount).toBe(1);
    });

    it("should reflect status changes", () => {
        const aggregate = ImageAggregate.create(
            ImageId.fromString("img-789"),
            SessionId.fromString("ses-789"),
            GenerationType.TEXT_TO_IMAGE,
            "provider-1",
            ModelIdentifier.create("model", "v1"),
            ImageDimensions.create(1024, 768),
            ImageStyle.PHOTOREALISTIC,
            ResourceBudget.create(8192, 16384, 60000, 4096),
            "test",
            AssetProvenance.create("hash", ModelIdentifier.create("model", "v1"), ProviderId.create(), "ses-789")
        );

        let summary = ImageProjection.projectSummary(aggregate);
        expect(summary.status).toBe("Initializing");

        aggregate.setState(ImageRuntimeState.Rendering);
        summary = ImageProjection.projectSummary(aggregate);
        expect(summary.status).toBe("Rendering");

        aggregate.setSelectedCandidateId("cnd-1");
        summary = ImageProjection.projectSummary(aggregate);
        expect(summary.selectedCandidateId).toBe("cnd-1");
    });
});
