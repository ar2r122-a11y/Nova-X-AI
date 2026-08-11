import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IEndingRegistryRepository } from "../../Domain/Repositories/IEndingRegistryRepository";
import { EndingRegistryAggregate } from "../../Domain/Aggregates/EndingRegistryAggregate";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { Ending } from "../../Domain/Entities/Ending";
import { StoryVersion } from "../../Domain/ValueObjects/StoryVersion";

interface StoredEndingRegistryEntity {
    id: string;
    data: string;
}

export class EndingRegistryRepositoryImpl implements IEndingRegistryRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredEndingRegistryEntity | null>;
        save(entity: StoredEndingRegistryEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredEndingRegistryEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredEndingRegistryEntity>("ending_registries");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll(),
        };
    }

    async save(registry: EndingRegistryAggregate): Promise<void> {
        const snapshot = registry.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredEndingRegistryEntity = {
            id: registry.getRegistryId(),
            data: serialized,
        };
        await this.storageRepository.save(entity);
    }

    async getByStoryId(storyId: StoryId): Promise<EndingRegistryAggregate | null> {
        const entities = await this.storageRepository.getAll();
        const matching = entities.find((e) => {
            try {
                const snapshot = JSON.parse(e.data);
                return snapshot.storyId === storyId.getValue();
            } catch {
                return false;
            }
        });

        if (!matching) {
            return null;
        }

        const snapshot = JSON.parse(matching.data);
        return this.reconstitute(snapshot);
    }

    async delete(registryId: string): Promise<void> {
        await this.storageRepository.delete(registryId);
    }

    private reconstitute(snapshot: any): EndingRegistryAggregate {
        const storyId = StoryId.create(snapshot.storyId);
        const version = StoryVersion.create(snapshot.version);

        const endings = (snapshot.endings || []).map((e: any) =>
            Ending.reconstitute({
                endingId: e.endingId,
                storyId,
                title: e.title,
                description: e.description,
                type: e.type,
                conditions: new Map(Object.entries(e.conditions || {})),
                narrativeFlags: new Map(Object.entries(e.narrativeFlags || {})),
                isUnlocked: e.isUnlocked,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
            })
        );

        return EndingRegistryAggregate.reconstitute({
            registryId: snapshot.registryId,
            storyId,
            endings,
            unlockedEndingIds: snapshot.unlockedEndingIds || [],
            version,
            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
        });
    }
}
