import { describe, it, expect } from "vitest";
import { Region } from "../../../src/Domain/Entities/Region";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("Region", () => {
    it("test_creation_succeeds_with_valid_data", () => {
        const region = Region.create(
            RegionId.create("region-1"),
            "Forest",
            "A dense forest",
            SpatialCoordinate.origin(),
            SpatialCoordinate.create(100, 100, 0),
            ["loc-1", "loc-2"]
        );
        expect(region.getId().getValue()).toBe("region-1");
        expect(region.getName()).toBe("Forest");
        expect(region.getLocationIds()).toHaveLength(2);
    });

    it("test_creation_throws_with_empty_name", () => {
        expect(() => Region.create(RegionId.create("r1"), "", "desc", SpatialCoordinate.origin(), SpatialCoordinate.create(1,1,1), [])).toThrow();
    });

    it("test_contains_coordinate_returns_true_for_point_inside_bounds", () => {
        const region = Region.create(
            RegionId.create("r1"),
            "Region",
            "Desc",
            SpatialCoordinate.create(0, 0, 0),
            SpatialCoordinate.create(10, 10, 0),
            []
        );
        expect(region.containsCoordinate(SpatialCoordinate.create(5, 5, 0))).toBe(true);
        expect(region.containsCoordinate(SpatialCoordinate.create(0, 0, 0))).toBe(true);
        expect(region.containsCoordinate(SpatialCoordinate.create(10, 10, 0))).toBe(true);
    });

    it("test_contains_coordinate_returns_false_for_point_outside_bounds", () => {
        const region = Region.create(
            RegionId.create("r1"),
            "Region",
            "Desc",
            SpatialCoordinate.create(0, 0, 0),
            SpatialCoordinate.create(10, 10, 0),
            []
        );
        expect(region.containsCoordinate(SpatialCoordinate.create(11, 5, 0))).toBe(false);
    });

    it("test_has_location_returns_correctly", () => {
        const region = Region.create(
            RegionId.create("r1"),
            "Region",
            "Desc",
            SpatialCoordinate.origin(),
            SpatialCoordinate.create(1, 1, 1),
            ["loc-1"]
        );
        expect(region.hasLocation("loc-1")).toBe(true);
        expect(region.hasLocation("loc-2")).toBe(false);
    });
});

