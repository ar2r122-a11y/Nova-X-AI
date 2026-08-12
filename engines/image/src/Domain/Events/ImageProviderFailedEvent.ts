
import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";

export class ImageProviderFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_IMG_ImageProviderFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly imageId: ImageId,
        public readonly providerId: string,
        public readonly reason: string,
        correlation: CorrelationMetadata
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlation.getCorrelationId();
    }
}
