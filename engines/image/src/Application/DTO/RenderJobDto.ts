import { RenderJob } from "../../Domain/Entities/RenderJob";

export class RenderJobDto {
    constructor(
        public readonly jobId: string,
        public readonly imageId: string,
        public readonly providerId: string,
        public readonly status: string,
        public readonly priority: number,
        public readonly attempts: number,
        public readonly maxAttempts: number,
        public readonly errorMessage: string | null,
        public readonly resultAssetId: string | null,
        public readonly startedAt: number | null,
        public readonly completedAt: number | null,
        public readonly createdAt: number
    ) {}

    static fromEntity(job: RenderJob): RenderJobDto {
        return new RenderJobDto(
            job.jobId.getValue(),
            job.imageId.getValue(),
            job.providerId,
            job.status,
            job.priority,
            job.attempts,
            job.maxAttempts,
            job.errorMessage,
            job.resultAssetId,
            job.startedAt,
            job.completedAt,
            job.createdAt
        );
    }
}
