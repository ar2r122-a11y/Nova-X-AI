
import { ImageAsset } from "../Entities/ImageAsset";
import { ImageId } from "../ValueObjects/ImageId";

export interface IImageAssetRepository {
    findById(id: string): Promise<ImageAsset | null>;
    save(asset: ImageAsset): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: ImageId): Promise<ImageAsset[]>;
    getByCandidateId(candidateId: string): Promise<ImageAsset[]>;
    getPrimaryAvatar(): Promise<ImageAsset | null>;
}
