import type { RegionRegistryAggregate } from "../Aggregates/RegionRegistryAggregate";
import { WorldId } from "../ValueObjects/WorldId";

export interface IRegionRegistryRepository {
    findByWorldId(worldId: WorldId): Promise<RegionRegistryAggregate | null>;
    save(aggregate: RegionRegistryAggregate): Promise<void>;
}
