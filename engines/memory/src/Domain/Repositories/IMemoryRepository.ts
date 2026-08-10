export interface IMemoryRepository {
    save(memory: import("../Entities/MemoryEntry").MemoryEntry): Promise<void>;
    getById(id: string): Promise<import("../Entities/MemoryEntry").MemoryEntry | null>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getAll(): Promise<import("../Entities/MemoryEntry").MemoryEntry[]>;
    getByOwnerId(ownerId: string): Promise<import("../Entities/MemoryEntry").MemoryEntry[]>;
    getByType(ownerId: string, type: string): Promise<import("../Entities/MemoryEntry").MemoryEntry[]>;
    getByClusterId(clusterId: string): Promise<import("../Entities/MemoryEntry").MemoryEntry[]>;
    getActiveMemories(ownerId: string): Promise<import("../Entities/MemoryEntry").MemoryEntry[]>;
    countByOwner(ownerId: string): Promise<number>;
}
