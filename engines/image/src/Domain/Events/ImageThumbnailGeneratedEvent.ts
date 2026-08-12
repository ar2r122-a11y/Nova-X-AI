
import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";

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
