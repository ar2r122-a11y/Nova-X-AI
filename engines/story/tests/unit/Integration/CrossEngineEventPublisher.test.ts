import { describe, test, expect, vi } from "vitest";
import { CrossEngineEventPublisher } from "../../../src/Infrastructure/Integration/CrossEngineEventPublisher";

describe("CrossEngineEventPublisher", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const publisher = new CrossEngineEventPublisher(mockEventBus);

    test("publishes narrative milestone", async () => {
        await publisher.publishNarrativeMilestone({
            storyId: "story-1",
            milestoneId: "ms-1",
            milestoneType: "chapter",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    test("publishes scene narrative update", async () => {
        await publisher.publishSceneNarrativeUpdate({
            storyId: "story-1",
            sceneId: "scene-1",
            narrativeText: "text",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    test("publishes relationship milestone", async () => {
        await publisher.publishRelationshipMilestone({
            storyId: "story-1",
            characterId: "char-1",
            milestoneType: "bond",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    test("publishes world temporal context", async () => {
        await publisher.publishWorldTemporalContext({
            storyId: "story-1",
            worldTime: 1000,
            locationId: "loc-1",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    test("publishes character narrative", async () => {
        await publisher.publishCharacterNarrative({
            storyId: "story-1",
            characterId: "char-1",
            narrativeRole: "protagonist",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    test("publishes asset scene boundary", async () => {
        await publisher.publishAssetSceneBoundary({
            storyId: "story-1",
            sceneId: "scene-1",
            assetType: "voice",
            assetId: "asset-1",
            correlationId: "corr-1",
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
});
