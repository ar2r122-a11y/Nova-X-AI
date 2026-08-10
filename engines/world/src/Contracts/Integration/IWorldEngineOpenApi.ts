export interface IWorldEngineOpenApi {
    getWorldMap(worldId: string): Promise<{ worldId: string; regions: Record<string, unknown> }>;
    getTemporalState(worldId: string): Promise<{ worldId: string; timeOfDay: string; calendarDate: string; season: string; tickCount: number }>;
    getWorldState(worldId: string): Promise<{ worldId: string; state: string; version: number; globalVariables: Record<string, unknown> }>;
    getSpatialContext(worldId: string, locationId: string): Promise<{ worldId: string; locationId: string; regionId: string; presentNpcs: string[]; environment: Record<string, unknown> }>;
}
