import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IWorldRepository } from "../../Domain/Repositories/IWorldRepository";
import { WorldAggregate } from "../../Domain/Aggregates/WorldAggregate";
import { WorldId } from "../../Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../../Domain/ValueObjects/WorldState";
import { RegionId } from "../../Domain/ValueObjects/RegionId";
import { GlobalVariableKey } from "../../Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../../Domain/ValueObjects/GlobalVariableValue";
import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";
import { WorldHistoryEntry } from "../../Domain/Entities/WorldHistoryEntry";

interface StoredWorldEntity {
    id: string;
    data: string;
}

export class WorldRepositoryImpl implements IWorldRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredWorldEntity | null>;
        save(entity: StoredWorldEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredWorldEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredWorldEntity>("worlds");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(worldId: WorldId): Promise<WorldAggregate | null> {
        const entity = await this.storageRepository.getById(worldId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async save(aggregate: WorldAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredWorldEntity = {
            id: aggregate.getWorldId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): WorldAggregate {
        const worldId = WorldId.fromString(snapshot.worldId);
        const worldState = WorldStateRef.create(snapshot.worldState);
        const regionIds = (snapshot.regionIds as string[]).map((id) => RegionId.create(id));
        const globalVariables = new Map(
            (snapshot.globalVariables as any[]).map((gv) => [
                gv.key,
                GlobalVariableValue.create(gv.value, gv.type)
            ])
        );
        const history = (snapshot.history as any[]).map((h) =>
            WorldHistoryEntry.create(
                WorldEventVersion.create(h.version),
                h.eventType,
                h.timestamp,
                h.payload,
                h.correlationId
            )
        );
        const version = WorldEventVersion.create(snapshot.version);
        return WorldAggregate.reconstitute(worldId, worldState, regionIds, globalVariables, history, version);
    }
}
