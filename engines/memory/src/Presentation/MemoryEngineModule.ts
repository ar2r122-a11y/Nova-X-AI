import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { MemoryEngine } from "../Infrastructure/MemoryEngine";
import { MemoryRepositoryImpl } from "../Infrastructure/Persistence/MemoryRepositoryImpl";
import { MemoryDecayWorker, MemoryConsolidationWorker, MemoryPruningWorker, MemoryCacheWorker } from "../Infrastructure/Workers";
import type { IMemoryWorker } from "../Contracts/IMemoryEngine";
import { MemoryStoredEvent, MemoryRetrievedEvent, MemoryDecayedEvent, MemoryForgottenEvent, MemoryConsolidatedEvent, MemoryClusterFormedEvent, MemoryPrunedEvent } from "../Domain/Events";

const MEMORY_ENGINE = Symbol("MemoryEngine");

export class MemoryEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/memory";
    private engine: MemoryEngine | null = null;
    private workers: IMemoryWorker[] = [];

    configureServices(container: IContainer): void {
        container.registerSingleton(MEMORY_ENGINE, MemoryEngine);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;

        const repository = new MemoryRepositoryImpl(storageEngine);
        const engine = new MemoryEngine(eventBus, repository);

        const decayWorker = new MemoryDecayWorker();
        const consolidationWorker = new MemoryConsolidationWorker();
        const pruningWorker = new MemoryPruningWorker();
        const cacheWorker = new MemoryCacheWorker();

        decayWorker.setMemoryEngine(engine);
        consolidationWorker.setMemoryEngine(engine);
        pruningWorker.setMemoryEngine(engine);
        pruningWorker.setRepository(repository);
        cacheWorker.setMemoryEngine(engine);
        cacheWorker.setRepository(repository);

        this.workers = [decayWorker, consolidationWorker, pruningWorker, cacheWorker];
        this.engine = engine;

        eventBus.subscribe("EVT_MEM_MemoryStored", this.createHandler((event: MemoryStoredEvent) => this.handleMemoryStored(event)));
        eventBus.subscribe("EVT_MEM_MemoryRetrieved", this.createHandler((event: MemoryRetrievedEvent) => this.handleMemoryRetrieved(event)));
        eventBus.subscribe("EVT_MEM_MemoryDecayed", this.createHandler((event: MemoryDecayedEvent) => this.handleMemoryDecayed(event)));
        eventBus.subscribe("EVT_MEM_MemoryForgotten", this.createHandler((event: MemoryForgottenEvent) => this.handleMemoryForgotten(event)));
        eventBus.subscribe("EVT_MEM_MemoryConsolidated", this.createHandler((event: MemoryConsolidatedEvent) => this.handleMemoryConsolidated(event)));
        eventBus.subscribe("EVT_MEM_MemoryClusterFormed", this.createHandler((event: MemoryClusterFormedEvent) => this.handleMemoryClusterFormed(event)));
        eventBus.subscribe("EVT_MEM_MemoryPruned", this.createHandler((event: MemoryPrunedEvent) => this.handleMemoryPruned(event)));

        for (const worker of this.workers) {
            await worker.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.engine = null;
    }

    getMemoryEngine(): MemoryEngine | null {
        return this.engine;
    }

    private createHandler<T>(fn: (event: T) => Promise<void>): { handle: (event: T) => Promise<void> } {
        return { handle: fn };
    }

    private handleMemoryStored(_event: MemoryStoredEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryRetrieved(_event: MemoryRetrievedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryDecayed(_event: MemoryDecayedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryForgotten(_event: MemoryForgottenEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryConsolidated(_event: MemoryConsolidatedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryClusterFormed(_event: MemoryClusterFormedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleMemoryPruned(_event: MemoryPrunedEvent): Promise<void> {
        return Promise.resolve();
    }
}
