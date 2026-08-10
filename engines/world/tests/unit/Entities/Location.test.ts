import { describe, it, expect } from "vitest";
import { Location } from "../../../src/Domain/Entities/Location";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("Location", () => {
    it("test_creation_succeeds_with_valid_data", () => {
        const location = Location.create(
            LocationId.create("loc-1"),
            RegionId.create("region-1"),
            "Village",
            "A small village",
            SpatialCoordinate.create(50, 50, 0),
            100
        );
        expect(location.getId().getValue()).toBe("loc-1");
        expect(location.getName()).toBe("Village");
        expect(location.getCapacity()).toBe(100);
    });

    it("test_creation_throws_with_empty_name", () => {
        expect(() => Location.create(LocationId.create("l1"), RegionId.create("r1"), "", "desc", SpatialCoordinate.origin(), 10)).toThrow();
    });

    it("test_creation_throws_with_negative_capacity", () => {
        expect(() => Location.create(LocationId.create("l1"), RegionId.create("r1"), "Name", "desc", SpatialCoordinate.origin(), -1)).toThrow();
    });
});

