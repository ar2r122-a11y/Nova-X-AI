import { ImageAggregate } from "../../Domain/Aggregates/ImageAggregate";

export class ImageSummaryDto {
    constructor(
        public readonly imageId: string,
        public readonly sessionId: string,
        public readonly ownerId: string,
        public readonly mode: string,
        public readonly status: string,
        public readonly selectedCandidateId: string | null,
        public readonly candidateCount: number,
        public readonly createdAt: number
    ) {}

    static fromAggregate(aggregate: ImageAggregate): ImageSummaryDto {
        return new ImageSummaryDto(
            aggregate.getId().getValue(),
            aggregate.getSessionId().getValue(),
            aggregate.getOwnerId(),
            aggregate.getMode(),
            aggregate.getStatus(),
            aggregate.getSelectedCandidateId(),
            aggregate.getCandidates().length,
            aggregate.getCreatedAt()
        );
    }
}
