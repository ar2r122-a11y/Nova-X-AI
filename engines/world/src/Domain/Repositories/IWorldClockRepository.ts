import type { WorldClockAggregate } from "../Aggregates/WorldClockAggregate";
import { WorldId } from "../ValueObjects/WorldId";

export interface IWorldClockRepository {
    findByWorldId(worldId: WorldId): Promise<WorldClockAggregate | null>;
    save(aggregate: WorldClockAggregate): Promise<void>;
}
