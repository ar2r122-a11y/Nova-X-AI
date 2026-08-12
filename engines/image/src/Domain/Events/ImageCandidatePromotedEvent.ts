
import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";

export class ImageCandidatePromotedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageCandidatePromoted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly assetId: string,
        public readonly isPrimary: boolean,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}
