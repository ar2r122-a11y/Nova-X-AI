import type { WorldEventStoreAggregate } from "../Aggregates/WorldEventStoreAggregate";
import { WorldId } from "../ValueObjects/WorldId";

export interface IWorldEventStoreRepository {
    findByWorldId(worldId: WorldId): Promise<WorldEventStoreAggregate | null>;
    save(aggregate: WorldEventStoreAggregate): Promise<void>;
}
