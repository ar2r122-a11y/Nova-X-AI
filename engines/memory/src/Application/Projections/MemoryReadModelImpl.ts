import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryClusterDto } from "../DTO/MemoryClusterDto";
import type { MemoryReadModel } from "./MemoryReadModel";

export class MemoryReadModelImpl implements MemoryReadModel {
    memories = new Map<string, MemoryRecordDto>();
    clusters = new Map<string, MemoryClusterDto>();
    ownerIndex = new Map<string, Set<string>>();
    typeIndex = new Map<string, Set<string>>();
    clusterIndex = new Map<string, Set<string>>();

    upsertMemory(dto: MemoryRecordDto): void {
        this.memories.set(dto.memoryId, dto);
        this.ensureIndexSet(this.ownerIndex, dto.ownerId).add(dto.memoryId);
        this.ensureIndexSet(this.typeIndex, dto.memoryType).add(dto.memoryId);
        if (dto.clusterId) {
            this.ensureIndexSet(this.clusterIndex, dto.clusterId).add(dto.memoryId);
        }
    }

    removeMemory(memoryId: string): void {
        const memory = this.memories.get(memoryId);
        if (!memory) {
            return;
        }
        this.memories.delete(memoryId);
        this.removeFromIndex(this.ownerIndex, memory.ownerId, memoryId);
        this.removeFromIndex(this.typeIndex, memory.memoryType, memoryId);
        if (memory.clusterId) {
            this.removeFromIndex(this.clusterIndex, memory.clusterId, memoryId);
        }
    }

    getByOwner(ownerId: string): MemoryRecordDto[] {
        const ids = this.ownerIndex.get(ownerId);
        if (!ids) {
            return [];
        }
        return Array.from(ids).map((id) => this.memories.get(id)).filter((m): m is MemoryRecordDto => m !== undefined);
    }

    getByType(ownerId: string, type: string): MemoryRecordDto[] {
        const typeIds = this.typeIndex.get(type);
        if (!typeIds) {
            return [];
        }
        return Array.from(typeIds)
            .map((id) => this.memories.get(id))
            .filter((m): m is MemoryRecordDto => m !== undefined && m.ownerId === ownerId);
    }

    getByCluster(clusterId: string): MemoryRecordDto[] {
        const clusterIds = this.clusterIndex.get(clusterId);
        if (!clusterIds) {
            return [];
        }
        return Array.from(clusterIds).map((id) => this.memories.get(id)).filter((m): m is MemoryRecordDto => m !== undefined);
    }

    private ensureIndexSet(map: Map<string, Set<string>>, key: string): Set<string> {
        const existing = map.get(key);
        if (existing) {
            return existing;
        }
        const set = new Set<string>();
        map.set(key, set);
        return set;
    }

    private removeFromIndex(map: Map<string, Set<string>>, key: string, value: string): void {
        const set = map.get(key);
        if (set) {
            set.delete(value);
            if (set.size === 0) {
                map.delete(key);
            }
        }
    }
}
