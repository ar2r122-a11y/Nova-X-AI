import { RegionRegistryAggregate } from "../Aggregates/RegionRegistryAggregate";
import { LocationId } from "../ValueObjects/LocationId";

export class IsLocationOccupiedSpecification {
    static isSatisfiedBy(aggregate: RegionRegistryAggregate, locationId: LocationId, timestamp: number): boolean {
        const npcs = aggregate.getNpcPresenceAtLocation(locationId, timestamp);
        return npcs.length > 0;
    }
}
