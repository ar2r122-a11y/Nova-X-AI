import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IWorldEventStoreRepository } from "../../Domain/Repositories/IWorldEventStoreRepository";
import { WorldEventStoreAggregate } from "../../Domain/Aggregates/WorldEventStoreAggregate";
import { WorldId } from "../../Domain/ValueObjects/WorldId";
import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";
import { WorldHistoryEntry } from "../../Domain/Entities/WorldHistoryEntry";
import { ScheduledWorldEvent } from "../../Domain/Entities/ScheduledWorldEvent";

interface StoredWorldEventStoreEntity {
    id: string;
    data: string;
}

export class WorldEventStoreRepositoryImpl implements IWorldEventStoreRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredWorldEventStoreEntity | null>;
        save(entity: StoredWorldEventStoreEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredWorldEventStoreEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredWorldEventStoreEntity>("world-event-stores");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findByWorldId(worldId: WorldId): Promise<WorldEventStoreAggregate | null> {
        const entity = await this.storageRepository.getById(worldId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async save(aggregate: WorldEventStoreAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredWorldEventStoreEntity = {
            id: aggregate.getWorldId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): WorldEventStoreAggregate {
        const worldId = WorldId.fromString(snapshot.worldId);

        const events = (snapshot.events as any[]).map((e) =>
            WorldHistoryEntry.create(
                WorldEventVersion.create(e.version),
                e.eventType,
                e.timestamp,
                e.payload,
                e.correlationId
            )
        );

        const scheduledEvents = (snapshot.scheduledEvents as any[]).map((e) =>
            ScheduledWorldEvent.create(e.eventId, e.eventType, e.triggerTime, e.payload)
        );

        const version = WorldEventVersion.create(snapshot.version);
        return WorldEventStoreAggregate.reconstitute(worldId, events, scheduledEvents, version);
    }
}
