import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";
import { EmotionAggregate } from "../../Domain/Aggregates/EmotionAggregate";

interface StoredEmotionEntity {
    id: string;
    data: string;
}

export class EmotionRepositoryImpl implements IEmotionRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredEmotionEntity | null>;
        save(entity: StoredEmotionEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredEmotionEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredEmotionEntity>("emotions");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findByCharacterId(characterId: string): Promise<EmotionAggregate | null> {
        const entity = await this.storageRepository.getById(characterId);
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return EmotionAggregate.reconstitute(snapshot);
    }

    async save(aggregate: EmotionAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredEmotionEntity = {
            id: aggregate.getCharacterId(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }
}
