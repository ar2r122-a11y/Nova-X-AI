import type { IEventBus } from "@nova-x-ai/core";
import { GenerateImageCommand, SelectCandidateCommand, DeleteImageCommand, CancelImageCommand } from "../Application/Commands";
import { GetImageQuery, ListImagesQuery, GetRenderJobQuery, GetCandidateQuery, ListRenderJobsQuery } from "../Application/Queries";
import { ImageDetailDto, ImageSummaryDto, RenderJobDto, CandidateDto } from "../Application/DTO";
import type { IImageRepository } from "./IImageRepository";
import type { IRenderJobRepository } from "./IRenderJobRepository";
import type { IImageAssetRepository } from "./IImageAssetRepository";
import type { IImageCandidateRepository } from "./IImageCandidateRepository";

export interface IImageEngine {
    readonly eventBus: IEventBus;
    generateImage(command: GenerateImageCommand): Promise<ImageDetailDto>;
    selectCandidate(command: SelectCandidateCommand): Promise<void>;
    deleteImage(command: DeleteImageCommand): Promise<void>;
    cancelImage(command: CancelImageCommand): Promise<void>;
    getImage(query: GetImageQuery): Promise<ImageDetailDto>;
    listImages(query: ListImagesQuery): Promise<ImageSummaryDto[]>;
    getRenderJob(query: GetRenderJobQuery): Promise<RenderJobDto | null>;
    listRenderJobs(query: ListRenderJobsQuery): Promise<RenderJobDto[]>;
    getCandidate(query: GetCandidateQuery): Promise<CandidateDto | null>;
    getRepository(): IImageRepository;
    getRenderJobRepository(): IRenderJobRepository;
    getAssetRepository(): IImageAssetRepository;
    getCandidateRepository(): IImageCandidateRepository;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}
