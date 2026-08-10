import { RegionId } from "../ValueObjects/RegionId";
import { SpatialCoordinate } from "../ValueObjects/SpatialCoordinate";

export class Region {
    private readonly id: RegionId;
    private name: string;
    private description: string;
    private readonly boundsMin: SpatialCoordinate;
    private readonly boundsMax: SpatialCoordinate;
    private readonly locationIds: string[];
    private readonly createdAt: number;

    private constructor(
        id: RegionId,
        name: string,
        description: string,
        boundsMin: SpatialCoordinate,
        boundsMax: SpatialCoordinate,
        locationIds: string[],
        createdAt: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.boundsMin = boundsMin;
        this.boundsMax = boundsMax;
        this.locationIds = locationIds;
        this.createdAt = createdAt;
    }

    static create(
        id: RegionId,
        name: string,
        description: string,
        boundsMin: SpatialCoordinate,
        boundsMax: SpatialCoordinate,
        locationIds: string[]
    ): Region {
        if (!name || name.trim().length === 0) {
            throw new Error("Region name cannot be empty.");
        }
        if (!description || description.trim().length === 0) {
            throw new Error("Region description cannot be empty.");
        }
        return new Region(id, name.trim(), description.trim(), boundsMin, boundsMax, locationIds, Date.now());
    }

    getId(): RegionId {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getBoundsMin(): SpatialCoordinate {
        return this.boundsMin;
    }

    getBoundsMax(): SpatialCoordinate {
        return this.boundsMax;
    }

    getLocationIds(): readonly string[] {
        return this.locationIds;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    containsCoordinate(coordinate: SpatialCoordinate): boolean {
        return (
            coordinate.getX() >= this.boundsMin.getX() &&
            coordinate.getX() <= this.boundsMax.getX() &&
            coordinate.getY() >= this.boundsMin.getY() &&
            coordinate.getY() <= this.boundsMax.getY() &&
            coordinate.getZ() >= this.boundsMin.getZ() &&
            coordinate.getZ() <= this.boundsMax.getZ()
        );
    }

    hasLocation(locationId: string): boolean {
        return this.locationIds.includes(locationId);
    }
}
