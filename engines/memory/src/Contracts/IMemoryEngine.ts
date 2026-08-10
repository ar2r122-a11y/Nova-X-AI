import type { VectorMetadata } from "../Domain/ValueObjects/VectorMetadata";

export interface IMemoryEngine {
    readonly eventBus: import("@nova-x-ai/core").IEventBus;
    storeMemory(command: StoreMemoryCommand): Promise<MemoryRecordDto>;
    pruneMemories(command: PruneMemoriesCommand): Promise<MemoryPruningResponseDto>;
    recallMemory(query: RecallMemoryQuery): Promise<MemoryRetrievalResultDto[]>;
    getMemoryContext(query: GetMemoryContextQuery): Promise<MemoryContextDto>;
    consolidateMemories(command: ConsolidateMemoriesCommand): Promise<MemoryClusterDto>;
    forgetMemory(command: ForgetMemoryCommand): Promise<void>;
    getMemory(query: GetMemoryQuery): Promise<MemoryRecordDto | null>;
    getMemoriesByType(query: GetMemoriesByTypeQuery): Promise<MemoryRecordDto[]>;
    getMemoriesForCharacter(query: GetMemoriesForCharacterQuery): Promise<MemoryRecordDto[]>;
    getClusters(query: GetMemoryClustersQuery): Promise<MemoryClusterDto[]>;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}

export interface StoreMemoryCommand {
    readonly content: string;
    readonly memoryType: string;
    readonly ownerId: string;
    readonly salience: number;
    readonly tags: string[];
    readonly claims: { roles: string[]; permissions: string[] };
    readonly sourceEventId?: string;
    readonly clusterId?: string;
    readonly vector?: number[];
}

export interface PruneMemoriesCommand {
    readonly ownerId: string;
    readonly minSalience: number;
    readonly maxAgeMs: number;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface RecallMemoryQuery {
    readonly ownerId: string;
    readonly queryText: string;
    readonly limit: number;
    readonly memoryTypes: string[];
    readonly requesterId: string;
}

export interface GetMemoryContextQuery {
    readonly ownerId: string;
    readonly contextTokenLimit: number;
    readonly memoryTypes: string[];
    readonly requesterId: string;
}

export interface ConsolidateMemoriesCommand {
    readonly ownerId: string;
    readonly memoryIds: string[];
    readonly clusterId?: string;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface ForgetMemoryCommand {
    readonly memoryId: string;
    readonly ownerId: string;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface GetMemoryQuery {
    readonly memoryId: string;
    readonly requesterId: string;
}

export interface GetMemoriesByTypeQuery {
    readonly ownerId: string;
    readonly memoryType: string;
    readonly requesterId: string;
    readonly limit: number;
}

export interface GetMemoriesForCharacterQuery {
    readonly ownerId: string;
    readonly requesterId: string;
    readonly limit: number;
    readonly minSalience: number;
}

export interface GetMemoryClustersQuery {
    readonly ownerId: string;
    readonly requesterId: string;
}

export interface MemoryRecordDto {
    readonly memoryId: string;
    readonly memoryType: string;
    readonly content: string;
    readonly salience: number;
    readonly ownerId: string;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly lastAccessedAt: number;
    readonly accessCount: number;
    readonly state: string;
    readonly tags: string[];
    readonly contentHash: string;
    readonly clusterId?: string;
    readonly vectorMetadata?: VectorMetadata;
    readonly sourceEventId?: string;
}

export interface MemoryPruningResponseDto {
    readonly prunedCount: number;
    readonly prunedMemoryIds: string[];
    readonly totalBefore: number;
    readonly totalAfter: number;
    readonly threshold: {
        minSalience: number;
        maxAgeMs: number;
        maxAccessCount: number;
    };
    readonly executedAt: number;
}

export interface MemoryContextDto {
    readonly ownerId: string;
    readonly memories: MemoryRecordDto[];
    readonly estimatedTokens: number;
    readonly contextBlock: string;
}

export interface MemoryClusterDto {
    readonly clusterId: string;
    readonly memberMemoryIds: string[];
    readonly memberCount: number;
    readonly createdAt: number;
    readonly updatedAt: number;
}

export interface MemoryRetrievalResultDto {
    readonly memory: MemoryRecordDto;
    readonly similarityScore: number;
    readonly relevanceRank: number;
}

export interface IMemoryWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export interface IMemoryContextBuilder {
    buildMemoryBlock(memories: MemoryRecordDto[]): string;
    buildPromptContext(ownerId: string, memories: MemoryRecordDto[], tokenLimit: number): MemoryContextDto;
}

export interface IMemoryConsolidationService {
    consolidate(ownerId: string, memoryIds: string[], clusterId?: string): Promise<MemoryClusterDto>;
}

export { VectorMetadata } from "../Domain/ValueObjects/VectorMetadata";
