export interface SpatialQueryCoordinate {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export interface ISpatialIndex {
    insert(coordinate: SpatialQueryCoordinate, entityId: string): void;
    remove(coordinate: SpatialQueryCoordinate, entityId: string): void;
    radiusSearch(center: SpatialQueryCoordinate, radius: number): string[];
    contains(coordinate: SpatialQueryCoordinate): boolean;
}
