import { GetImageQuery } from "../Queries/GetImageQuery";
import { ListImagesQuery } from "../Queries/ListImagesQuery";
import { GetCandidateQuery } from "../Queries/GetCandidateQuery";
import { GetRenderJobQuery } from "../Queries/GetRenderJobQuery";
import { ListRenderJobsQuery } from "../Queries/ListRenderJobsQuery";
import { ImageDetailDto } from "../DTO/ImageDetailDto";
import { ImageSummaryDto } from "../DTO/ImageSummaryDto";
import { CandidateDto } from "../DTO/CandidateDto";
import { RenderJobDto } from "../DTO/RenderJobDto";
import { ImageId } from "../../Domain/ValueObjects/ImageId";
import type { IImageRepository } from "../../Contracts/IImageRepository";
import type { IImageCandidateRepository } from "../../Contracts/IImageCandidateRepository";
import type { IRenderJobRepository } from "../../Contracts/IRenderJobRepository";

export class GetImageQueryHandler {
    constructor(private readonly repository: IImageRepository) {}

    async handle(query: GetImageQuery): Promise<ImageDetailDto | null> {
        const imageId = ImageId.fromString(query.imageId);
        const aggregate = await this.repository.findById(imageId.getValue());
        if (!aggregate) return null;
        return ImageDetailDto.fromAggregate(aggregate);
    }
}

export class ListImagesQueryHandler {
    constructor(private readonly repository: IImageRepository) {}

    async handle(query: ListImagesQuery): Promise<ImageSummaryDto[]> {
        const aggregates = query.ownerId
            ? await this.repository.getByOwnerId(query.ownerId)
            : query.sessionId
                ? await this.repository.getBySessionId(query.sessionId)
                : [];
        return aggregates.map((a) => ImageSummaryDto.fromAggregate(a));
    }
}

export class GetCandidateQueryHandler {
    constructor(private readonly repository: IImageCandidateRepository) {}

    async handle(query: GetCandidateQuery): Promise<CandidateDto | null> {
        const candidate = await this.repository.findById(query.candidateId);
        if (!candidate) return null;
        return CandidateDto.fromEntity(candidate);
    }
}

export class GetRenderJobQueryHandler {
    constructor(private readonly repository: IRenderJobRepository) {}

    async handle(query: GetRenderJobQuery): Promise<RenderJobDto | null> {
        const job = await this.repository.findById(query.jobId);
        if (!job) return null;
        return RenderJobDto.fromEntity(job);
    }
}

export class ListRenderJobsQueryHandler {
    constructor(private readonly repository: IRenderJobRepository) {}

    async handle(query: ListRenderJobsQuery): Promise<RenderJobDto[]> {
        const jobs = query.imageId
            ? await this.repository.getByImageId(query.imageId)
            : await this.repository.getActiveJobs();
        if (query.status) {
            return jobs.filter((j) => j.status === query.status).map((j) => RenderJobDto.fromEntity(j));
        }
        return jobs.map((j) => RenderJobDto.fromEntity(j));
    }
}