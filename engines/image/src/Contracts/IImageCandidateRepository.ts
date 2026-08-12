import { ImageCandidate } from "../Domain/Entities/ImageCandidate";

export interface IImageCandidateRepository {
    findById(id: string): Promise<ImageCandidate | null>;
    save(candidate: ImageCandidate): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: string): Promise<ImageCandidate[]>;
    getSelectedCandidate(imageId: string): Promise<ImageCandidate | null>;
}
