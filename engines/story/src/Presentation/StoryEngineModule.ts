import { ICoreModule, IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { StoryEngine } from "../Infrastructure/StoryEngine";
import { StoryRepositoryRegistry } from "../Infrastructure/Persistence/StoryRepositoryRegistry";
import { StoryRepositoryResolver } from "../Infrastructure/Persistence/StoryRepositoryResolver";
import { StoryCacheManager } from "../Infrastructure/Cache/StoryCacheManager";
import { ProjectionEngine } from "../Infrastructure/Projections/ProjectionEngine";
import { StoryProjectionReadRepository } from "../Infrastructure/Projections/StoryProjectionReadRepository";
import { SnapshotManager } from "../Infrastructure/Snapshots/SnapshotManager";
import { SnapshotRepository } from "../Infrastructure/Snapshots/SnapshotRepository";
import { IStoryEngine } from "../Contracts/IStoryEngine";

const STORY_ENGINE = Symbol("StoryEngine");

export class StoryEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/story";
    private engine: StoryEngine | null = null;
    private initialized = false;

    configureServices(container: IContainer): void {
        container.registerSingleton(STORY_ENGINE, StoryEngine);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;

        const engine = new StoryEngine(eventBus, storageEngine);
        this.engine = engine;

        const registry = new StoryRepositoryRegistry();
        registry.registerStoryRepository("default", engine.storyRepository);
        registry.registerQuestRepository("default", engine.questRepository);
        registry.registerEndingRegistryRepository("default", engine.endingRegistryRepository);

        const resolver = new StoryRepositoryResolver(registry);
        const cacheManager = new StoryCacheManager(storageEngine.getCacheProvider());
        const projectionEngine = new ProjectionEngine(storageEngine.getProjectionStore());
        const projectionReadRepository = new StoryProjectionReadRepository(storageEngine.getProjectionStore());
        const snapshotManager = new SnapshotManager(
            new SnapshotRepository(storageEngine.getSnapshotStore())
        );

        this.initialized = true;
    }

    async onDestroy(): Promise<void> {
        this.engine = null;
        this.initialized = false;
    }

    getState(): string {
        return this.initialized ? "active" : "inactive";
    }

    getEngine(): IStoryEngine | null {
        return this.engine;
    }
}
