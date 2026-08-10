import { LocationId } from "../ValueObjects/LocationId";
import { RegionId } from "../ValueObjects/RegionId";
import { SpatialCoordinate } from "../ValueObjects/SpatialCoordinate";

export class Location {
    private readonly id: LocationId;
    private readonly regionId: RegionId;
    private name: string;
    private description: string;
    private coordinate: SpatialCoordinate;
    private readonly capacity: number;
    private readonly createdAt: number;

    private constructor(
        id: LocationId,
        regionId: RegionId,
        name: string,
        description: string,
        coordinate: SpatialCoordinate,
        capacity: number,
        createdAt: number
    ) {
        this.id = id;
        this.regionId = regionId;
        this.name = name;
        this.description = description;
        this.coordinate = coordinate;
        this.capacity = capacity;
        this.createdAt = createdAt;
    }

    static create(
        id: LocationId,
        regionId: RegionId,
        name: string,
        description: string,
        coordinate: SpatialCoordinate,
        capacity: number
    ): Location {
        if (!name || name.trim().length === 0) {
            throw new Error("Location name cannot be empty.");
        }
        if (!description || description.trim().length === 0) {
            throw new Error("Location description cannot be empty.");
        }
        if (capacity < 0) {
            throw new Error("Location capacity cannot be negative.");
        }
        return new Location(id, regionId, name.trim(), description.trim(), coordinate, capacity, Date.now());
    }

    getId(): LocationId {
        return this.id;
    }

    getRegionId(): RegionId {
        return this.regionId;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getCoordinate(): SpatialCoordinate {
        return this.coordinate;
    }

    getCapacity(): number {
        return this.capacity;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }
}
