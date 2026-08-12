import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { ImageEngineImpl } from "../Infrastructure/ImageEngineImpl";
import { ImageRepositoryImpl, RenderJobRepositoryImpl, ImageAssetRepositoryImpl, ImageCandidateRepositoryImpl } from "../Infrastructure/Persistence/ImageRepositoryImpl";
import {
    ImageWorker,
    ImageStreamingWorker,
    ImageRecoveryWorker,
    SnapshotWorker,
    ProjectionWorker,
    CleanupRetentionWorker,
    CandidateBatchWorker,
    ThumbnailWorker
} from "../Infrastructure/Workers";
import type { IImageWorker } from "../Contracts/IImageWorker";
import {
    ImageGenerationRequestedEvent,
    ImageGenerationStartedEvent,
    ImageGenerationCompletedEvent,
    ImageGenerationFailedEvent,
    ImageAssetFinalizedEvent,
    ImageCandidateGeneratedEvent,
    ImageCandidateSelectedEvent,
    ImageCandidatePromotedEvent,
    ImageThumbnailGeneratedEvent,
    ImageRecoveryCompletedEvent,
    ImageResourceBudgetExceededEvent
} from "../Domain/Events/ImageDomainEvents";

const IMAGE_ENGINE = Symbol("ImageEngine");

export class ImageEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/image";
    private engine: ImageEngineImpl | null = null;
    private workers: IImageWorker[] = [];

    configureServices(container: IContainer): void {
        container.registerSingleton(IMAGE_ENGINE, ImageEngineImpl);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;

        const imageRepository = new ImageRepositoryImpl(storageEngine);
        const renderJobRepository = new RenderJobRepositoryImpl(storageEngine);
        const assetRepository = new ImageAssetRepositoryImpl(storageEngine);
        const candidateRepository = new ImageCandidateRepositoryImpl(storageEngine);
        const providerOrchestrator = new (await import("../Infrastructure/Providers/MultiProviderImageOrchestrator")).MultiProviderImageOrchestrator();
        const promptOrchestrator = new (await import("../Domain/Services/ImageEngineServices")).ImagePromptOrchestrator();

        const engine = new ImageEngineImpl(
            eventBus,
            imageRepository,
            renderJobRepository,
            assetRepository,
            candidateRepository,
            providerOrchestrator,
            promptOrchestrator
        );

        const worker = new ImageWorker();
        const streamingWorker = new ImageStreamingWorker();
        const recoveryWorker = new ImageRecoveryWorker();
        const snapshotWorker = new SnapshotWorker();
        const projectionWorker = new ProjectionWorker();
        const cleanupWorker = new CleanupRetentionWorker();
        const candidateBatchWorker = new CandidateBatchWorker();
        const thumbnailWorker = new ThumbnailWorker();

        worker.setImageEngine(engine);
        snapshotWorker.setImageRepository(imageRepository);

        this.workers = [worker, streamingWorker, recoveryWorker, snapshotWorker, projectionWorker, cleanupWorker, candidateBatchWorker, thumbnailWorker];
        this.engine = engine;

        eventBus.subscribe("EVT_IMG_ImageGenerationRequested", this.createHandler((event: ImageGenerationRequestedEvent) => this.handleImageGenerationRequested(event)));
        eventBus.subscribe("EVT_IMG_ImageGenerationStarted", this.createHandler((event: ImageGenerationStartedEvent) => this.handleImageGenerationStarted(event)));
        eventBus.subscribe("EVT_IMG_ImageGenerated", this.createHandler((event: ImageGenerationCompletedEvent) => this.handleImageGenerationCompleted(event)));
        eventBus.subscribe("EVT_IMG_ImageGenerationFailed", this.createHandler((event: ImageGenerationFailedEvent) => this.handleImageGenerationFailed(event)));
        eventBus.subscribe("EVT_IMG_ImageAssetFinalized", this.createHandler((event: ImageAssetFinalizedEvent) => this.handleImageAssetFinalized(event)));
        eventBus.subscribe("EVT_IMG_ImageCandidateGenerated", this.createHandler((event: ImageCandidateGeneratedEvent) => this.handleImageCandidateGenerated(event)));
        eventBus.subscribe("EVT_IMG_ImageCandidateSelected", this.createHandler((event: ImageCandidateSelectedEvent) => this.handleImageCandidateSelected(event)));
        eventBus.subscribe("EVT_IMG_ImageCandidatePromoted", this.createHandler((event: ImageCandidatePromotedEvent) => this.handleImageCandidatePromoted(event)));
        eventBus.subscribe("EVT_IMG_ImageThumbnailGenerated", this.createHandler((event: ImageThumbnailGeneratedEvent) => this.handleImageThumbnailGenerated(event)));
        eventBus.subscribe("EVT_IMG_ImageRecoveryCompleted", this.createHandler((event: ImageRecoveryCompletedEvent) => this.handleImageRecoveryCompleted(event)));
        eventBus.subscribe("EVT_IMG_ImageResourceBudgetExceeded", this.createHandler((event: ImageResourceBudgetExceededEvent) => this.handleImageResourceBudgetExceeded(event)));

        for (const w of this.workers) {
            await w.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.engine = null;
    }

    getImageEngine(): ImageEngineImpl | null {
        return this.engine;
    }

    private createHandler<T>(fn: (event: T) => Promise<void>): { handle: (event: T) => Promise<void> } {
        return { handle: fn };
    }

    private handleImageGenerationRequested(_event: ImageGenerationRequestedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageGenerationStarted(_event: ImageGenerationStartedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageGenerationCompleted(_event: ImageGenerationCompletedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageGenerationFailed(_event: ImageGenerationFailedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageAssetFinalized(_event: ImageAssetFinalizedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageCandidateGenerated(_event: ImageCandidateGeneratedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageCandidateSelected(_event: ImageCandidateSelectedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageCandidatePromoted(_event: ImageCandidatePromotedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageThumbnailGenerated(_event: ImageThumbnailGeneratedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageRecoveryCompleted(_event: ImageRecoveryCompletedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleImageResourceBudgetExceeded(_event: ImageResourceBudgetExceededEvent): Promise<void> {
        return Promise.resolve();
    }
}
