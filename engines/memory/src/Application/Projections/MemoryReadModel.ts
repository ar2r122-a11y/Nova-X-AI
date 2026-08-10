import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryClusterDto } from "../DTO/MemoryClusterDto";

export interface MemoryReadModel {
    memories: Map<string, MemoryRecordDto>;
    clusters: Map<string, MemoryClusterDto>;
    ownerIndex: Map<string, Set<string>>;
    typeIndex: Map<string, Set<string>>;
    clusterIndex: Map<string, Set<string>>;
    upsertMemory(dto: MemoryRecordDto): void;
    removeMemory(memoryId: string): void;
    getByOwner(ownerId: string): MemoryRecordDto[];
    getByType(ownerId: string, type: string): MemoryRecordDto[];
    getByCluster(clusterId: string): MemoryRecordDto[];
}
