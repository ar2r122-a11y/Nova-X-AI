import { describe, it, expect } from "vitest";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("SpatialCoordinate", () => {
    it("test_creation_succeeds_with_valid_coordinates", () => {
        const coord = SpatialCoordinate.create(10.0, 20.0, 5.0);
        expect(coord.getX()).toBe(10.0);
        expect(coord.getY()).toBe(20.0);
        expect(coord.getZ()).toBe(5.0);
    });

    it("test_distance_to_calculates_euclidean_distance", () => {
        const a = SpatialCoordinate.create(0, 0, 0);
        const b = SpatialCoordinate.create(3, 4, 0);
        expect(a.distanceTo(b)).toBeCloseTo(5.0);
    });

    it("test_equality_works_correctly", () => {
        const a = SpatialCoordinate.create(1, 2, 3);
        const b = SpatialCoordinate.create(1, 2, 3);
        const c = SpatialCoordinate.create(1, 2, 4);
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
    });
});

