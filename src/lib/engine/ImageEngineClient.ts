import type { IEventBus } from "@nova-x-ai/core";
import { ImageEngineImpl, FakeImageProviderAdapter } from "@nova-x-ai/image";
import { ImagePromptOrchestrator } from "@nova-x-ai/image/Domain/Services/ImageEngineServices";
import { getSharedStorageEngine } from "./SharedInfrastructure";
import { ImageRepositoryAdapter, RenderJobRepositoryAdapter, ImageAssetRepositoryAdapter, ImageCandidateRepositoryAdapter } from "./ImageRepositoryAdapters";

export class ImageEngineClient {
    private static instance: ImageEngineImpl | null = null;
    private static initPromise: Promise<ImageEngineImpl> | null = null;

    static async getEngine(): Promise<ImageEngineImpl> {
        if (ImageEngineClient.instance) {
            return ImageEngineClient.instance;
        }
        if (ImageEngineClient.initPromise) {
            return ImageEngineClient.initPromise;
        }

        ImageEngineClient.initPromise = ImageEngineClient.createEngine();
        ImageEngineClient.instance = await ImageEngineClient.initPromise;
        return ImageEngineClient.instance;
    }

    static async createEngine(): Promise<ImageEngineImpl> {
        const storageEngine = getSharedStorageEngine();
        const eventBus = storageEngine.eventBus as IEventBus;

        const imageRepo = storageEngine.getRepository<any>("images");
        const renderJobRepo = storageEngine.getRepository<any>("render_jobs");
        const assetRepo = storageEngine.getRepository<any>("image_assets");
        const candidateRepo = storageEngine.getRepository<any>("image_candidates");

        const providerOrchestrator = new (await import("@nova-x-ai/image")).MultiProviderImageOrchestrator();
        const fakeProvider = new FakeImageProviderAdapter();
        fakeProvider.setLatencyMs(50);
        providerOrchestrator.registerProvider("fake", fakeProvider, 1);

        const promptOrchestrator = new ImagePromptOrchestrator();

        const engine = new ImageEngineImpl(
            eventBus,
            new ImageRepositoryAdapter(imageRepo),
            new RenderJobRepositoryAdapter(renderJobRepo),
            new ImageAssetRepositoryAdapter(assetRepo),
            new ImageCandidateRepositoryAdapter(candidateRepo),
            providerOrchestrator,
            promptOrchestrator
        );

        return engine;
    }

    static async reset(): Promise<void> {
        if (ImageEngineClient.instance) {
            await ImageEngineClient.instance.shutdown();
            ImageEngineClient.instance = null;
            ImageEngineClient.initPromise = null;
        }
        localStorage.removeItem("nova-storage");
    }
}
