import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";
import { MemoryEntry } from "../../Domain/Entities/MemoryEntry";

interface StoredMemoryEntity {
    id: string;
    data: string;
}

export class MemoryRepositoryImpl implements IMemoryRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredMemoryEntity | null>;
        save(entity: StoredMemoryEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredMemoryEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredMemoryEntity>("memories");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async save(memory: MemoryEntry): Promise<void> {
        const snapshot = memory.toSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredMemoryEntity = {
            id: memory.getId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async getById(id: string): Promise<MemoryEntry | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return MemoryEntry.reconstitute(snapshot);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async exists(id: string): Promise<boolean> {
        return this.storageRepository.exists(id);
    }

    async getAll(): Promise<MemoryEntry[]> {
        const entities = await this.storageRepository.getAll();
        return entities.map((entity) => {
            const snapshot = JSON.parse(entity.data);
            return MemoryEntry.reconstitute(snapshot);
        });
    }

    async getByOwnerId(ownerId: string): Promise<MemoryEntry[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getOwnerId() === ownerId);
    }

    async getByType(ownerId: string, type: string): Promise<MemoryEntry[]> {
        const all = await this.getByOwnerId(ownerId);
        return all.filter((m) => m.getType().getValue() === type);
    }

    async getByClusterId(clusterId: string): Promise<MemoryEntry[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getClusterId()?.getValue() === clusterId);
    }

    async getActiveMemories(ownerId: string): Promise<MemoryEntry[]> {
        const all = await this.getByOwnerId(ownerId);
        return all.filter((m) => m.getState().isActive());
    }

    async countByOwner(ownerId: string): Promise<number> {
        const all = await this.getByOwnerId(ownerId);
        return all.length;
    }
}
