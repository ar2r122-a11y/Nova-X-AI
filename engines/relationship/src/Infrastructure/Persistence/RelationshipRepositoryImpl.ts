import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";
import { RelationshipAggregate } from "../../Domain/Aggregates/RelationshipAggregate";

interface StoredRelationshipEntity {
    id: string;
    data: string;
}

export class RelationshipRepositoryImpl implements IRelationshipRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredRelationshipEntity | null>;
        save(entity: StoredRelationshipEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredRelationshipEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredRelationshipEntity>("relationships");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(relationshipId: string): Promise<RelationshipAggregate | null> {
        const entity = await this.storageRepository.getById(relationshipId);
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return RelationshipAggregate.reconstitute(snapshot);
    }

    async findByParticipants(sourceId: string, targetId: string): Promise<RelationshipAggregate | null> {
        const all = await this.storageRepository.getAll();
        for (const entity of all) {
            const snapshot = JSON.parse(entity.data);
            if ((snapshot.sourceEntityId === sourceId && snapshot.targetEntityId === targetId) ||
                (snapshot.sourceEntityId === targetId && snapshot.targetEntityId === sourceId)) {
                return RelationshipAggregate.reconstitute(snapshot);
            }
        }
        return null;
    }

    async save(aggregate: RelationshipAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredRelationshipEntity = {
            id: aggregate.getRelationshipId(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(relationshipId: string): Promise<void> {
        await this.storageRepository.delete(relationshipId);
    }

    async getAll(): Promise<RelationshipAggregate[]> {
        const entities = await this.storageRepository.getAll();
        return entities.map(entity => {
            const snapshot = JSON.parse(entity.data);
            return RelationshipAggregate.reconstitute(snapshot);
        });
    }
}
