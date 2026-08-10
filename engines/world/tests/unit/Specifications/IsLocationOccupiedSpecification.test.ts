import { describe, it, expect } from "vitest";
import { IsLocationOccupiedSpecification } from "../../../src/Domain/Specifications/IsLocationOccupiedSpecification";
import { RegionRegistryAggregate } from "../../../src/Domain/Aggregates/RegionRegistryAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { Region } from "../../../src/Domain/Entities/Region";
import { Location } from "../../../src/Domain/Entities/Location";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("IsLocationOccupiedSpecification", () => {
    it("test_returns_false_when_location_is_empty", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), ["loc-1"]);
        aggregate.registerRegion(region);
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.create(5, 5, 0), 100);
        aggregate.registerLocation(location);
        expect(IsLocationOccupiedSpecification.isSatisfiedBy(aggregate, LocationId.create("loc-1"), 1000)).toBe(false);
    });

    it("test_returns_true_when_location_has_npc_present", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), ["loc-1"]);
        aggregate.registerRegion(region);
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.create(5, 5, 0), 100);
        aggregate.registerLocation(location);
        aggregate.updateNpcPresence("char-1", LocationId.create("loc-1"), "arrived", 1000);
        aggregate.commitEvents();
        expect(IsLocationOccupiedSpecification.isSatisfiedBy(aggregate, LocationId.create("loc-1"), 1500)).toBe(true);
    });
});

