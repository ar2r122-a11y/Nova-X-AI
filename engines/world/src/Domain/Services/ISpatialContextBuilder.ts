export interface ISpatialContextBuilder {
    buildContext(worldId: string, locationId: string, timestamp: number): Promise<{
        locationId: string;
        regionId: string;
        presentNpcs: string[];
        environment: import("../ValueObjects/EnvironmentConditions").EnvironmentConditions;
    }>;
    findLocationsInRadius(worldId: string, coordinate: import("../ValueObjects/SpatialCoordinate").SpatialCoordinate, radiusKm: number): Promise<string[]>;
}
