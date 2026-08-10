import type { WorldAggregate } from "../Aggregates/WorldAggregate";
import type { WorldClockAggregate } from "../Aggregates/WorldClockAggregate";
import type { RegionRegistryAggregate } from "../Aggregates/RegionRegistryAggregate";
import type { WorldEventStoreAggregate } from "../Aggregates/WorldEventStoreAggregate";

export interface IWorldDomainService {
    initializeWorld(worldId: string, name: string): Promise<WorldAggregate>;
    advanceSimulation(worldId: string, secondsToAdvance: number): Promise<WorldClockAggregate>;
    updateNpcPresence(worldId: string, characterId: string, locationId: string, action: "arrived" | "departed"): Promise<RegionRegistryAggregate>;
    updateGlobalVariable(worldId: string, key: string, value: unknown, type: string): Promise<WorldAggregate>;
    transitionWorldState(worldId: string, targetState: string): Promise<WorldAggregate>;
}
