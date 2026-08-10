import type { WorldAggregate } from "../Aggregates/WorldAggregate";
import { WorldId } from "../ValueObjects/WorldId";

export interface IWorldRepository {
    findById(worldId: WorldId): Promise<WorldAggregate | null>;
    save(aggregate: WorldAggregate): Promise<void>;
}
