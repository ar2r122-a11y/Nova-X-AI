import { describe, it, expect } from "vitest";
import {
    ImageGenerationCompletedEvent,
    ImageGenerationFailedEvent,
    ImageCandidateSelectedEvent,
    ImageAssetDeletedEvent,
    ImageThumbnailGeneratedEvent
} from "../../src/Domain/Events/ImageDomainEvents";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { CorrelationMetadata } from "../../src/Domain/ValueObjects/CorrelationMetadata";

describe("Events", () => {
    const correlation = CorrelationMetadata.generate();
    const imageId = ImageId.fromString("img-123");

    it("ImageGenerationCompletedEvent should have correct eventType", () => {
        const event = new ImageGenerationCompletedEvent(imageId, "ast-1", 1, correlation);
        expect(event.eventType).toBe("EVT_IMG_ImageGenerated");
        expect(event.timestamp).toBeGreaterThan(0);
        expect(event.correlationId).toBe(correlation.getCorrelationId());
    });

    it("ImageGenerationFailedEvent should have correct payload", () => {
        const event = new ImageGenerationFailedEvent(imageId, "timeout", correlation);
        expect(event.eventType).toBe("EVT_IMG_ImageGenerationFailed");
        expect(event.reason).toBe("timeout");
    });

    it("ImageCandidateSelectedEvent should have correct payload", () => {
        const event = new ImageCandidateSelectedEvent(imageId, "cnd-1", 0.95, correlation);
        expect(event.eventType).toBe("EVT_IMG_ImageCandidateSelected");
        expect(event.score).toBe(0.95);
    });

    it("ImageAssetDeletedEvent should have correct payload", () => {
        const event = new ImageAssetDeletedEvent(imageId, "ast-1", correlation);
        expect(event.eventType).toBe("EVT_IMG_ImageAssetDeleted");
    });

    it("ImageThumbnailGeneratedEvent should have correct payload", () => {
        const event = new ImageThumbnailGeneratedEvent(imageId, "thumb-1", 256, correlation);
        expect(event.eventType).toBe("EVT_IMG_ImageThumbnailGenerated");
        expect(event.size).toBe(256);
    });

    it("all events should have unique timestamps", () => {
        const event1 = new ImageGenerationCompletedEvent(imageId, "ast-1", 1, correlation);
        const event2 = new ImageGenerationCompletedEvent(imageId, "ast-1", 1, correlation);
        expect(event1.timestamp).toBeLessThanOrEqual(event2.timestamp);
    });
});