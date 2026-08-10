import { describe, it, expect } from "vitest";
import { SpatialCoordinateValidPolicy } from "../../../src/Domain/Policies/SpatialCoordinateValidPolicy";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("SpatialCoordinateValidPolicy", () => {
    it("test_returns_true_for_coordinate_inside_bounds", () => {
        const coord = SpatialCoordinate.create(5, 5, 5);
        const min = SpatialCoordinate.create(0, 0, 0);
        const max = SpatialCoordinate.create(10, 10, 10);
        expect(SpatialCoordinateValidPolicy.isValid(coord, min, max)).toBe(true);
    });

    it("test_returns_false_for_coordinate_outside_bounds", () => {
        const coord = SpatialCoordinate.create(15, 5, 5);
        const min = SpatialCoordinate.create(0, 0, 0);
        const max = SpatialCoordinate.create(10, 10, 10);
        expect(SpatialCoordinateValidPolicy.isValid(coord, min, max)).toBe(false);
    });

    it("test_returns_true_for_coordinate_on_boundary", () => {
        const min = SpatialCoordinate.create(0, 0, 0);
        const max = SpatialCoordinate.create(10, 10, 10);
        expect(SpatialCoordinateValidPolicy.isValid(min, min, max)).toBe(true);
        expect(SpatialCoordinateValidPolicy.isValid(max, min, max)).toBe(true);
    });
});

