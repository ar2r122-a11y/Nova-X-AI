import type { IEventBus } from "@nova-x-ai/core";
import type { IMemoryEngine } from "../Contracts/IMemoryEngine";
import type { IMemoryRepository } from "../Domain/Repositories/IMemoryRepository";
import { StoreMemoryCommandHandler } from "../Application/Handlers/StoreMemoryCommandHandler";
import { PruneMemoriesCommandHandler } from "../Application/Handlers/PruneMemoriesCommandHandler";
import { ConsolidateMemoriesCommandHandler } from "../Application/Handlers/ConsolidateMemoriesCommandHandler";
import { ForgetMemoryCommandHandler } from "../Application/Handlers/ForgetMemoryCommandHandler";
import { RecallMemoryCommandHandler } from "../Application/Handlers/RecallMemoryCommandHandler";
import { GetMemoryQueryHandler } from "../Application/Handlers/GetMemoryQueryHandler";
import { GetMemoriesByTypeQueryHandler } from "../Application/Handlers/GetMemoriesByTypeQueryHandler";
import { GetMemoryContextQueryHandler } from "../Application/Handlers/GetMemoryContextQueryHandler";
import { GetMemoriesForCharacterQueryHandler } from "../Application/Handlers/GetMemoriesForCharacterQueryHandler";
import { GetMemoryClustersQueryHandler } from "../Application/Handlers/GetMemoryClustersQueryHandler";
import { MemoryDecayWorker, MemoryConsolidationWorker, MemoryPruningWorker, MemoryCacheWorker } from "./Workers";
import { MemoryRecordDto } from "../Application/DTO/MemoryRecordDto";
import { MemoryPruningResponseDto } from "../Application/DTO/MemoryPruningResponseDto";
import { MemoryContextDto } from "../Application/DTO/MemoryContextDto";
import { MemoryClusterDto } from "../Application/DTO/MemoryClusterDto";
import { MemoryRetrievalResultDto } from "../Application/DTO/MemoryRetrievalResultDto";
import { StoreMemoryCommand } from "../Application/Commands/StoreMemoryCommand";
import { PruneMemoriesCommand } from "../Application/Commands/PruneMemoriesCommand";
import { ConsolidateMemoriesCommand } from "../Application/Commands/ConsolidateMemoriesCommand";
import { ForgetMemoryCommand } from "../Application/Commands/ForgetMemoryCommand";
import { RecallMemoryCommand } from "../Application/Commands/RecallMemoryCommand";
import { GetMemoryQuery } from "../Application/Queries/GetMemoryQuery";
import { GetMemoriesByTypeQuery } from "../Application/Queries/GetMemoriesByTypeQuery";
import { GetMemoryContextQuery } from "../Application/Queries/GetMemoryContextQuery";
import { GetMemoriesForCharacterQuery } from "../Application/Queries/GetMemoriesForCharacterQuery";
import { GetMemoryClustersQuery } from "../Application/Queries/GetMemoryClustersQuery";

export class MemoryEngine implements IMemoryEngine {
    readonly eventBus: IEventBus;
    private repository: IMemoryRepository;
    private workers: import("../Contracts/IMemoryEngine").IMemoryWorker[] = [];
    private initialized = false;

    constructor(
        eventBus: IEventBus,
        repository: IMemoryRepository
    ) {
        this.eventBus = eventBus;
        this.repository = repository;
    }

    getRepository(): IMemoryRepository {
        return this.repository;
    }

    async storeMemory(command: StoreMemoryCommand): Promise<MemoryRecordDto> {
        const handler = new StoreMemoryCommandHandler(this.eventBus, this.repository);
        return handler.handle(command);
    }

    async pruneMemories(command: PruneMemoriesCommand): Promise<MemoryPruningResponseDto> {
        const handler = new PruneMemoriesCommandHandler(this.repository, this.eventBus);
        return handler.handle(command);
    }

    async recallMemory(query: RecallMemoryCommand): Promise<MemoryRetrievalResultDto[]> {
        const handler = new RecallMemoryCommandHandler(this.repository);
        return handler.handle(query);
    }

    async getMemoryContext(query: GetMemoryContextQuery): Promise<MemoryContextDto> {
        const handler = new GetMemoryContextQueryHandler(this.repository);
        return handler.handle(query);
    }

    async consolidateMemories(command: ConsolidateMemoriesCommand): Promise<MemoryClusterDto> {
        const handler = new ConsolidateMemoriesCommandHandler(this.repository, this.eventBus);
        return handler.handle(command);
    }

    async forgetMemory(command: ForgetMemoryCommand): Promise<void> {
        const handler = new ForgetMemoryCommandHandler(this.eventBus, this.repository);
        return handler.handle(command);
    }

    async getMemory(query: GetMemoryQuery): Promise<MemoryRecordDto | null> {
        const handler = new GetMemoryQueryHandler(this.repository);
        return handler.handle(query);
    }

    async getMemoriesByType(query: GetMemoriesByTypeQuery): Promise<MemoryRecordDto[]> {
        const handler = new GetMemoriesByTypeQueryHandler(this.repository);
        return handler.handle(query);
    }

    async getMemoriesForCharacter(query: GetMemoriesForCharacterQuery): Promise<MemoryRecordDto[]> {
        const handler = new GetMemoriesForCharacterQueryHandler(this.repository);
        return handler.handle(query);
    }

    async getClusters(query: GetMemoryClustersQuery): Promise<MemoryClusterDto[]> {
        const handler = new GetMemoryClustersQueryHandler(this.repository);
        return handler.handle(query);
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const decayWorker = new MemoryDecayWorker();
        const consolidationWorker = new MemoryConsolidationWorker();
        const pruningWorker = new MemoryPruningWorker();
        const cacheWorker = new MemoryCacheWorker();

        decayWorker.setMemoryEngine(this);
        decayWorker.setRepository(this.repository);
        consolidationWorker.setMemoryEngine(this);
        consolidationWorker.setRepository(this.repository);
        pruningWorker.setMemoryEngine(this);
        pruningWorker.setRepository(this.repository);
        cacheWorker.setMemoryEngine(this);
        cacheWorker.setRepository(this.repository);

        this.workers = [decayWorker, consolidationWorker, pruningWorker, cacheWorker];

        for (const worker of this.workers) {
            await worker.start();
        }

        this.initialized = true;
    }

    async shutdown(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.initialized = false;
    }
}
