
import { ImageId } from "../ValueObjects/ImageId";
import { ImageAggregate } from "../Aggregates/ImageAggregate";
import { CandidateId } from "../ValueObjects/CandidateId";
import { ImageCandidate } from "../Entities/ImageCandidate";
import { AssetId } from "../ValueObjects/AssetId";
import { ImageAsset } from "../Entities/ImageAsset";
import { RenderId } from "../ValueObjects/RenderId";
import { RenderJob } from "../Entities/RenderJob";

export interface IImageRepository {
    save(aggregate: ImageAggregate): Promise<void>;
    findById(imageId: ImageId): Promise<ImageAggregate | null>;
    delete(imageId: ImageId): Promise<void>;
}

export interface IRenderJobRepository {
    save(job: RenderJob): Promise<void>;
    findById(renderJobId: RenderId): Promise<RenderJob | null>;
    findByImageId(imageId: ImageId): Promise<RenderJob[]>;
    delete(renderJobId: RenderId): Promise<void>;
}

export interface IImageAssetRepository {
    save(asset: ImageAsset): Promise<void>;
    findByImageId(imageId: ImageId): Promise<ImageAsset[]>;
    findById(assetId: AssetId): Promise<ImageAsset | null>;
    delete(assetId: AssetId): Promise<void>;
}

export interface IImageCandidateRepository {
    save(candidate: ImageCandidate): Promise<void>;
    findByImageId(imageId: ImageId): Promise<ImageCandidate[]>;
    findById(candidateId: CandidateId): Promise<ImageCandidate | null>;
    delete(candidateId: CandidateId): Promise<void>;
}
