import { IProjectionStore } from "@nova-x-ai/storage";

export interface WorldStateReadModel {
    readonly worldId: string;
    readonly state: string;
    readonly regions: { id: string; name: string; locationCount: number }[];
    readonly timeline: {
        currentTime: string;
        currentDate: string;
        currentSeason: string;
        tickCount: number;
    };
    readonly environment: {
        temperatureCelsius: number;
        precipitationMm: number;
        windSpeedKmh: number;
        cloudCoverPercent: number;
        description: string;
    };
    readonly lastUpdated: number;
}

export interface TimelineReadModel {
    readonly worldId: string;
    readonly currentTime: number;
    readonly currentDate: string;
    readonly currentSeason: string;
    readonly tickCount: number;
}

export interface SpatialContextReadModel {
    readonly worldId: string;
    readonly locationId: string;
    readonly regionId: string;
    readonly presentNpcs: string[];
    readonly environment: {
        weather: string;
        timeOfDay: string;
        season: string;
        visibilityKm: number;
        ambientLightLevel: number;
    };
}

export interface NpcPresenceReadModel {
    readonly worldId: string;
    readonly locationId: string;
    readonly presentNpcs: string[];
    readonly updatedAt: number;
}

export interface GlobalVariablesReadModel {
    readonly worldId: string;
    readonly variables: { key: string; value: unknown; updatedAt: number }[];
}

export class WorldProjectionReadRepository {
    constructor(private readonly projectionStore: IProjectionStore) {}

    async getWorldState(worldId: string): Promise<WorldStateReadModel | null> {
        const data = await this.projectionStore.getProjection(`world-state-projection:${worldId}`);
        return data as WorldStateReadModel | null;
    }

    async getTimeline(worldId: string): Promise<TimelineReadModel | null> {
        const data = await this.projectionStore.getProjection(`temporal-projection:${worldId}`);
        return data as TimelineReadModel | null;
    }

    async getSpatialContext(worldId: string, locationId: string): Promise<SpatialContextReadModel | null> {
        const data = await this.projectionStore.getProjection(`spatial-projection:${worldId}:${locationId}`);
        return data as SpatialContextReadModel | null;
    }

    async getNpcPresence(worldId: string, locationId: string): Promise<NpcPresenceReadModel | null> {
        const data = await this.projectionStore.getProjection(`spatial-projection:${worldId}:${locationId}`);
        return data as NpcPresenceReadModel | null;
    }

    async getGlobalVariables(worldId: string): Promise<GlobalVariablesReadModel | null> {
        const names = await this.projectionStore.listProjections();
        const prefix = `global-variable-projection:${worldId}:`;
        const variables: { key: string; value: unknown; updatedAt: number }[] = [];

        for (const name of names) {
            if (name.startsWith(prefix)) {
                const data = await this.projectionStore.getProjection(name);
                const projection = data as { key: string; value: unknown; updatedAt: number } | undefined;
                if (projection) {
                    variables.push(projection);
                }
            }
        }

        return {
            worldId,
            variables
        };
    }
}
