import { RenderJob } from "../Domain/Entities/RenderJob";

export interface IRenderJobRepository {
    findById(id: string): Promise<RenderJob | null>;
    save(job: RenderJob): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getByImageId(imageId: string): Promise<RenderJob[]>;
    getActiveJobs(): Promise<RenderJob[]>;
}
