import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { IWorldEngineOpenApi } from "../../Contracts/Integration/IWorldEngineOpenApi";

export class WorldEngineOpenApi implements IWorldEngineOpenApi {
    constructor(private readonly engine: IWorldEngine) {}

    async getWorldMap(worldId: string): Promise<{ worldId: string; regions: Record<string, unknown> }> {
        const worldState = await this.engine.getWorldState(worldId);
        return {
            worldId,
            regions: worldState ? { state: worldState.state, version: worldState.version } : {}
        };
    }

    async getTemporalState(worldId: string): Promise<{ worldId: string; timeOfDay: string; calendarDate: string; season: string; tickCount: number }> {
        const worldState = await this.engine.getWorldState(worldId);
        return {
            worldId,
            timeOfDay: worldState ? `${worldState.version}` : "00:00:00",
            calendarDate: worldState ? new Date().toISOString().split("T")[0] : "1970-01-01",
            season: "unknown",
            tickCount: worldState ? worldState.version : 0
        };
    }

    async getWorldState(worldId: string): Promise<{ worldId: string; state: string; version: number; globalVariables: Record<string, unknown> }> {
        const worldState = await this.engine.getWorldState(worldId);
        if (!worldState) {
            return { worldId, state: "unknown", version: 0, globalVariables: {} };
        }
        return {
            worldId,
            state: worldState.state,
            version: worldState.version,
            globalVariables: {}
        };
    }

    async getSpatialContext(worldId: string, locationId: string): Promise<{ worldId: string; locationId: string; regionId: string; presentNpcs: string[]; environment: Record<string, unknown> }> {
        const worldState = await this.engine.getWorldState(worldId);
        return {
            worldId,
            locationId,
            regionId: "unknown",
            presentNpcs: [],
            environment: worldState ? { state: worldState.state } : {}
        };
    }
}
