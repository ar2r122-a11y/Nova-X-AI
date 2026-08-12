import { ImageAggregate } from "../../Domain/Aggregates/ImageAggregate";
import { CandidateDto } from "./CandidateDto";

export class ImageDetailDto {
    constructor(
        public readonly imageId: string,
        public readonly sessionId: string,
        public readonly ownerId: string,
        public readonly prompt: string,
        public readonly negativePrompt: string,
        public readonly mode: string,
        public readonly aspectRatio: string,
        public readonly status: string,
        public readonly selectedCandidateId: string | null,
        public readonly primaryAssetId: string | null,
        public readonly candidates: CandidateDto[],
        public readonly assets: Array<{
            assetId: string;
            uri: string;
            mimeType: string;
            width: number;
            height: number;
            sizeBytes: number;
            isPrimary: boolean;
            isAvatar: boolean;
        }>,
        public readonly metadata: Record<string, unknown>,
        public readonly createdAt: number,
        public readonly completedAt: number | null
    ) {}

    static fromAggregate(aggregate: ImageAggregate): ImageDetailDto {
        return new ImageDetailDto(
            aggregate.getId().getValue(),
            aggregate.getSessionId().getValue(),
            aggregate.getOwnerId(),
            aggregate.getPrompt(),
            aggregate.getNegativePrompt(),
            aggregate.getMode(),
            aggregate.getAspectRatio(),
            aggregate.getStatus(),
            aggregate.getSelectedCandidateId(),
            aggregate.getPrimaryAssetId()?.getValue() || null,
            aggregate.getCandidates().map((c) => CandidateDto.fromEntity(c)),
            aggregate.getAssets().map((a) => ({
                assetId: a.assetId.getValue(),
                uri: a.uri,
                mimeType: a.mimeType,
                width: a.width,
                height: a.height,
                sizeBytes: a.sizeBytes,
                isPrimary: a.isPrimary,
                isAvatar: a.isAvatar
            })),
            aggregate.getMetadata(),
            aggregate.getCreatedAt(),
            aggregate.getCompletedAt()
        );
    }
}
