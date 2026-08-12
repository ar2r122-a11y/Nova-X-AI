import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";

export class ImageGenerationRequestedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageGenerationRequested";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly generationType: string,
        public readonly prompt: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageGenerationStartedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageGenerationStarted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageGenerationCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageGenerated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        public readonly assetCount: number,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageGenerationFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageGenerationFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly reason: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageAssetFinalizedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageAssetFinalized";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageCandidateGeneratedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageCandidateGenerated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly candidateId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageCandidateSelectedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageCandidateSelected";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly candidateId: string,
        public readonly score: number,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageCandidatePromotedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageCandidatePromoted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly candidateId: string,
        public readonly isPrimary: boolean,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageVariationGeneratedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageVariationGenerated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly variationId: string,
        public readonly parentImageId: ImageId,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageInpaintingCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageInpaintingCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageOutpaintingCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageOutpaintingCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageEditingCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageEditingCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageThumbnailGeneratedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageThumbnailGenerated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly thumbnailId: string,
        public readonly size: number,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageStreamingStartedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageStreamingStarted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly chunkCount: number,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageStreamingCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageStreamingCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageRecoveryCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageRecoveryCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageRecoveryFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageRecoveryFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly reason: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageProviderFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageProviderFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly providerId: string,
        public readonly error: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageProviderFallbackTriggeredEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageProviderFallbackTriggered";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly originalProviderId: string,
        public readonly fallbackProviderId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageResourceBudgetExceededEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageResourceBudgetExceeded";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly resourceType: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageSafetyCheckFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageSafetyCheckFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly reason: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}

export class ImageAssetDeletedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageAssetDeleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}
