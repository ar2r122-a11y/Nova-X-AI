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
import { StorySecurityBoundary } from "../Infrastructure/Security/StorySecurityBoundary";
import { StoryEngineAclTranslator } from "../Infrastructure/ACL/StoryEngineAclTranslator";
import { StoryOpenHostService } from "../Presentation/OpenHost/StoryOpenHostService";
import { StoryMetrics } from "../Infrastructure/Observability/StoryMetrics";
import { StoryTracing } from "../Infrastructure/Observability/StoryTracing";
import { StoryRecoveryManager } from "../Infrastructure/Recovery/StoryRecoveryManager";
import { PluginExtensionBoundary } from "../Infrastructure/Plugins/PluginExtensionBoundary";
import { EventUpcaster } from "../Domain/Evolution/EventUpcaster";
import { SchemaMigration } from "../Domain/Evolution/SchemaMigration";
import { StoryRuntime } from "../Application/Services/StoryRuntime";
import { CommandValidationPipeline } from "../Application/Pipelines/CommandValidationPipeline";
import { SceneExecutionPipeline } from "../Application/Pipelines/SceneExecutionPipeline";
import { StoryWorker } from "../Infrastructure/Workers/StoryWorker";
import { SnapshotWorker } from "../Infrastructure/Workers/SnapshotWorker";
import { ReplayWorker } from "../Infrastructure/Workers/ReplayWorker";
import { CleanupWorker } from "../Infrastructure/Workers/CleanupWorker";
import { SynchronizationWorker } from "../Infrastructure/Workers/SynchronizationWorker";
import { AnalyticsWorker } from "../Infrastructure/Workers/AnalyticsWorker";
import { ProjectionWorker } from "../Infrastructure/Workers/ProjectionWorker";
import { WorkerLifecycleManager } from "../Infrastructure/Workers/WorkerLifecycleManager";
import { StoryProgressionSaga } from "../Domain/Sagas/StoryProgressionSaga";
import { CrossEngineEventPublisher } from "../Infrastructure/Integration/CrossEngineEventPublisher";
import { StoryHealthChecks } from "../Infrastructure/Health/StoryHealthChecks";
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

        new StoryRepositoryResolver(registry);
        new StoryCacheManager(storageEngine.getCacheProvider());
        const projectionEngine = new ProjectionEngine(storageEngine.getProjectionStore());
        new StoryProjectionReadRepository(storageEngine.getProjectionStore());
        const snapshotManager = new SnapshotManager(
            new SnapshotRepository(storageEngine.getSnapshotStore())
        );

        const securityBoundary = new StorySecurityBoundary(eventBus);
        const acl = new StoryEngineAclTranslator();
        new StoryMetrics(eventBus);
        new StoryTracing();
        new StoryRecoveryManager(
            engine.eventStoreRepository,
            engine.storyRepository,
            snapshotManager
        );
        new PluginExtensionBoundary(acl);
        new EventUpcaster();
        new SchemaMigration();
        new StoryOpenHostService(engine, securityBoundary, acl, eventBus);

        const runtime = new StoryRuntime(eventBus, engine.storyRepository);
        await runtime.initialize();

        new CommandValidationPipeline(securityBoundary, eventBus);
        new SceneExecutionPipeline(
            engine.storyRepository,
            engine.eventStoreRepository,
            engine.branchingService,
            engine.storyDomainService,
            eventBus
        );

        const storyWorker = new StoryWorker(eventBus, engine.storyDomainService);
        const snapshotWorker = new SnapshotWorker(eventBus, snapshotManager);
        const replayWorker = new ReplayWorker(eventBus, engine.eventStoreRepository, engine.storyRepository);
        const cleanupWorker = new CleanupWorker(eventBus);
        const synchronizationWorker = new SynchronizationWorker(eventBus);
        const analyticsWorker = new AnalyticsWorker(eventBus);
        const projectionWorker = new ProjectionWorker(eventBus);

        const workerLifecycleManager = new WorkerLifecycleManager();
        workerLifecycleManager.registerWorker(storyWorker);
        workerLifecycleManager.registerWorker(snapshotWorker);
        workerLifecycleManager.registerWorker(replayWorker);
        workerLifecycleManager.registerWorker(cleanupWorker);
        workerLifecycleManager.registerWorker(synchronizationWorker);
        workerLifecycleManager.registerWorker(analyticsWorker);
        workerLifecycleManager.registerWorker(projectionWorker);

        await workerLifecycleManager.startAll();

        const saga = new StoryProgressionSaga(eventBus, engine.storyRepository);
        await saga.initialize("default");

        new CrossEngineEventPublisher(eventBus);

        new StoryHealthChecks(
            eventBus,
            engine.storyRepository,
            engine.eventStoreRepository,
            projectionEngine,
            runtime,
            workerLifecycleManager
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
