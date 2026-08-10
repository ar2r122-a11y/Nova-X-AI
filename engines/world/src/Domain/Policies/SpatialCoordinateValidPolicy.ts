import { SpatialCoordinate } from "../ValueObjects/SpatialCoordinate";

export class SpatialCoordinateValidPolicy {
    static isValid(coordinate: SpatialCoordinate, min: SpatialCoordinate, max: SpatialCoordinate): boolean {
        return (
            coordinate.getX() >= min.getX() &&
            coordinate.getX() <= max.getX() &&
            coordinate.getY() >= min.getY() &&
            coordinate.getY() <= max.getY() &&
            coordinate.getZ() >= min.getZ() &&
            coordinate.getZ() <= max.getZ()
        );
    }
}
