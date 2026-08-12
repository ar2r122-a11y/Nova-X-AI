import { ImageAsset } from "../Domain/Entities/ImageAsset";

export interface IImageAssetRepository {
    findById(id: string): Promise<ImageAsset | null>;
    save(asset: ImageAsset): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: string): Promise<ImageAsset[]>;
    getByCandidateId(candidateId: string): Promise<ImageAsset[]>;
    getPrimaryAvatar(imageId: string): Promise<ImageAsset | null>;
}
