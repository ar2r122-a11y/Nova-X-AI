
import { RenderJob } from "../Entities/RenderJob";
import { ImageId } from "../ValueObjects/ImageId";

export interface IRenderJobRepository {
    findById(id: string): Promise<RenderJob | null>;
    save(job: RenderJob): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: ImageId): Promise<RenderJob[]>;
    getActiveJobs(): Promise<RenderJob[]>;
}
