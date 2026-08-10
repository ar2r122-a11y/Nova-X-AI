import { WorldId } from "../../Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../../Domain/ValueObjects/WorldState";
import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";

export class WorldAggregateDto {
    constructor(
        public readonly worldId: string,
        public readonly worldState: string,
        public readonly regionCount: number,
        public readonly globalVariableCount: number,
        public readonly historyLength: number,
        public readonly version: number
    ) {}

    static fromAggregate(aggregate: {
        getWorldId(): WorldId;
        getWorldState(): WorldStateRef;
        getRegionIds(): readonly import("../../Domain/ValueObjects/RegionId").RegionId[];
        getGlobalVariables(): ReadonlyMap<string, import("../../Domain/ValueObjects/GlobalVariableValue").GlobalVariableValue>;
        getHistory(): readonly import("../../Domain/Entities/WorldHistoryEntry").WorldHistoryEntry[];
        getVersion(): WorldEventVersion;
    }): WorldAggregateDto {
        return new WorldAggregateDto(
            aggregate.getWorldId().getValue(),
            aggregate.getWorldState().getValue(),
            aggregate.getRegionIds().length,
            aggregate.getGlobalVariables().size,
            aggregate.getHistory().length,
            aggregate.getVersion().getValue()
        );
    }
}
