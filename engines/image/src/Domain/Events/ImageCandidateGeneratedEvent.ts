
import { IDomainEvent } from "@nova-x-ai/core";
import { ImageId } from "../ValueObjects/ImageId";
import { CorrelationMetadata } from "../ValueObjects/CorrelationMetadata";

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
