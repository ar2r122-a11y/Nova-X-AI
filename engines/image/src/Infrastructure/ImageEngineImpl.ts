import { IEventBus } from "@nova-x-ai/core";
import type { IImageEngine } from "../Contracts/IImageEngine";
import type { IImageRepository } from "../Contracts/IImageRepository";
import type { IRenderJobRepository } from "../Contracts/IRenderJobRepository";
import type { IImageAssetRepository } from "../Contracts/IImageAssetRepository";
import type { IImageCandidateRepository } from "../Contracts/IImageCandidateRepository";
import { ImageAggregateFactory } from "../Domain/Aggregates/ImageAggregateFactory";
import { ImageId } from "../Domain/ValueObjects/ImageId";
import { ImageRuntimeState } from "../Domain/ValueObjects/ImageRuntimeState";
import { ImageNotFoundException } from "../Domain/Exceptions/ImageExceptions";
import { GenerateImageCommand } from "../Application/Commands/GenerateImageCommand";
import { SelectCandidateCommand } from "../Application/Commands/SelectCandidateCommand";
import { DeleteImageCommand } from "../Application/Commands/DeleteImageCommand";
import { CancelImageCommand } from "../Application/Commands/CancelImageCommand";
import { GetImageQuery } from "../Application/Queries/GetImageQuery";
import { ListImagesQuery } from "../Application/Queries/ListImagesQuery";
import { GetRenderJobQuery } from "../Application/Queries/GetRenderJobQuery";
import { GetCandidateQuery } from "../Application/Queries/GetCandidateQuery";
import { ListRenderJobsQuery } from "../Application/Queries/ListRenderJobsQuery";
import { ImageDetailDto } from "../Application/DTO/ImageDetailDto";
import { ImageSummaryDto } from "../Application/DTO/ImageSummaryDto";
import { RenderJobDto } from "../Application/DTO/RenderJobDto";
import { CandidateDto } from "../Application/DTO/CandidateDto";
import { MultiProviderImageOrchestrator } from "./Providers/MultiProviderImageOrchestrator";
import type { ImageGenerationRequest } from "../Domain/Services/ImageGenerationService";
import { ImagePromptOrchestrator } from "../Domain/Services/ImageEngineServices";
import { ImageDimensions } from "../Domain/ValueObjects/ImageDimensions";
import { ImageFormat } from "../Domain/ValueObjects/ImageFormat";
import { PromptCompilationResult } from "../Domain/ValueObjects/PromptCompilationResult";
import { ImageCandidate } from "../Domain/Entities/ImageCandidate";

export class ImageEngineImpl implements IImageEngine {
    readonly eventBus: IEventBus;
    private readonly imageRepository: IImageRepository;
    private readonly renderJobRepository: IRenderJobRepository;
    private readonly assetRepository: IImageAssetRepository;
    private readonly candidateRepository: IImageCandidateRepository;
    private readonly providerOrchestrator: MultiProviderImageOrchestrator;
    private readonly promptOrchestrator: ImagePromptOrchestrator;

    constructor(
        eventBus: IEventBus,
        imageRepository: IImageRepository,
        renderJobRepository: IRenderJobRepository,
        assetRepository: IImageAssetRepository,
        candidateRepository: IImageCandidateRepository,
        providerOrchestrator: MultiProviderImageOrchestrator,
        promptOrchestrator: ImagePromptOrchestrator
    ) {
        this.eventBus = eventBus;
        this.imageRepository = imageRepository;
        this.renderJobRepository = renderJobRepository;
        this.assetRepository = assetRepository;
        this.candidateRepository = candidateRepository;
        this.providerOrchestrator = providerOrchestrator;
        this.promptOrchestrator = promptOrchestrator;
    }

    async generateImage(command: GenerateImageCommand): Promise<ImageDetailDto> {
        const imageId = ImageId.create();
        const aggregate = ImageAggregateFactory.createFromTemplate({
            imageId: imageId.getValue(),
            sessionId: command.sessionId,
            ownerId: command.ownerId,
            prompt: command.prompt,
            negativePrompt: command.negativePrompt,
            mode: command.mode,
            aspectRatio: command.aspectRatio
        });

        const compiledPrompt = this.promptOrchestrator.compilePrompt(command.prompt);
        aggregate.compilePrompt(compiledPrompt.getCompiledPrompt());

        const request: ImageGenerationRequest = {
            imageId: imageId.getValue(),
            prompt: compiledPrompt.getCompiledPrompt(),
            negativePrompt: command.negativePrompt,
            width: command.width,
            height: command.height,
            seed: command.seed,
            candidateCount: command.candidateCount,
            mode: command.mode
        };

        const preferredModes = [command.mode];
        let result: { success: boolean; candidates: Array<{ uri: string; width: number; height: number; seed: number; score: number }>; providerId: string; latencyMs: number };

        try {
            result = await this.providerOrchestrator.executeGeneration(request, preferredModes);
        } catch (error) {
            aggregate.failRendering(error instanceof Error ? error.message : "Generation failed.");
            const events = aggregate.getUncommittedEvents();
            await this.imageRepository.save(aggregate);
            for (const event of events) {
                await this.eventBus.publish(event);
            }
            aggregate.commitEvents();
            return ImageDetailDto.fromAggregate(aggregate);
        }

        for (let i = 0; i < result.candidates.length; i++) {
            const c = result.candidates[i];
            const candidate = ImageCandidate.create({
                id: `cnd-${imageId.getValue()}-${i}`,
                candidateId: `cnd-${imageId.getValue()}-${i}`,
                imageId: imageId.getValue(),
                prompt: PromptCompilationResult.create(compiledPrompt.getCompiledPrompt()),
                negativePrompt: command.negativePrompt,
                dimensions: ImageDimensions.create(c.width, c.height),
                width: c.width,
                height: c.height,
                format: ImageFormat.PNG,
                generationType: command.mode,
                state: ImageRuntimeState.Rendering,
                score: c.score,
                seed: c.seed,
                uri: c.uri,
                isSelected: false,
                metadata: {},
                createdAt: Date.now()
            });
            aggregate.addCandidate(candidate);
        }

        aggregate.queueRender();
        aggregate.startRendering();

        if (result.success && result.candidates.length > 0) {
            aggregate.completeRendering(imageId.getValue());
        } else {
            aggregate.failRendering("No candidates generated.");
        }

        const events = aggregate.getUncommittedEvents();
        await this.imageRepository.save(aggregate);
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        return ImageDetailDto.fromAggregate(aggregate);
    }

    async selectCandidate(command: SelectCandidateCommand): Promise<void> {
        const imageId = ImageId.fromString(command.imageId);
        const aggregate = await this.imageRepository.findById(imageId.getValue());
        if (!aggregate) {
            throw new ImageNotFoundException(command.imageId);
        }
        aggregate.selectCandidate(command.candidateId);
        const events = aggregate.getUncommittedEvents();
        await this.imageRepository.save(aggregate);
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }

    async deleteImage(command: DeleteImageCommand): Promise<void> {
        const imageId = ImageId.fromString(command.imageId);
        await this.imageRepository.delete(imageId.getValue());
    }

    async cancelImage(command: CancelImageCommand): Promise<void> {
        const imageId = ImageId.fromString(command.imageId);
        const aggregate = await this.imageRepository.findById(imageId.getValue());
        if (!aggregate) {
            throw new ImageNotFoundException(command.imageId);
        }
        aggregate.cancel();
        const events = aggregate.getUncommittedEvents();
        await this.imageRepository.save(aggregate);
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }

    async getImage(query: GetImageQuery): Promise<ImageDetailDto> {
        const imageId = ImageId.fromString(query.imageId);
        const aggregate = await this.imageRepository.findById(imageId.getValue());
        if (!aggregate) {
            throw new ImageNotFoundException(query.imageId);
        }
        return ImageDetailDto.fromAggregate(aggregate);
    }

    async listImages(query: ListImagesQuery): Promise<ImageSummaryDto[]> {
        const aggregates = query.ownerId
            ? await this.imageRepository.getByOwnerId(query.ownerId)
            : query.sessionId
                ? await this.imageRepository.getBySessionId(query.sessionId)
                : [];
        return aggregates.map((a) => ImageSummaryDto.fromAggregate(a));
    }

    async getRenderJob(query: GetRenderJobQuery): Promise<RenderJobDto | null> {
        const job = await this.renderJobRepository.findById(query.jobId);
        if (!job) return null;
        return RenderJobDto.fromEntity(job);
    }

    async listRenderJobs(query: ListRenderJobsQuery): Promise<RenderJobDto[]> {
        const jobs = query.imageId
            ? await this.renderJobRepository.getByImageId(query.imageId)
            : await this.renderJobRepository.getActiveJobs();
        if (query.status) {
            return jobs.filter((j) => j.status === query.status).map((j) => RenderJobDto.fromEntity(j));
        }
        return jobs.map((j) => RenderJobDto.fromEntity(j));
    }

    async getCandidate(query: GetCandidateQuery): Promise<CandidateDto | null> {
        const candidate = await this.candidateRepository.findById(query.candidateId);
        if (!candidate) return null;
        return CandidateDto.fromEntity(candidate);
    }

    getRepository(): IImageRepository {
        return this.imageRepository;
    }

    getRenderJobRepository(): IRenderJobRepository {
        return this.renderJobRepository;
    }

    getAssetRepository(): IImageAssetRepository {
        return this.assetRepository;
    }

    getCandidateRepository(): IImageCandidateRepository {
        return this.candidateRepository;
    }

    async initialize(): Promise<void> {}

    async shutdown(): Promise<void> {}
}