
import { ImageCandidate } from "../Entities/ImageCandidate";
import { ImageId } from "../ValueObjects/ImageId";

export interface IImageCandidateRepository {
    findById(id: string): Promise<ImageCandidate | null>;
    save(candidate: ImageCandidate): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: ImageId): Promise<ImageCandidate[]>;
    getSelectedCandidate(): Promise<ImageCandidate | null>;
}
