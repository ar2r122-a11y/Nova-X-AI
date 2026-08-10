import { describe, it, expect } from "vitest";
import { RegionRegistryAggregate } from "../../../src/Domain/Aggregates/RegionRegistryAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { Region } from "../../../src/Domain/Entities/Region";
import { Location } from "../../../src/Domain/Entities/Location";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";

describe("RegionRegistryAggregate", () => {
    it("test_create_initializes_empty_registry", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        expect(aggregate.getAllRegions()).toHaveLength(0);
        expect(aggregate.getAllLocations()).toHaveLength(0);
    });

    it("test_register_region_adds_region", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), []);
        aggregate.registerRegion(region);
        expect(aggregate.getAllRegions()).toHaveLength(1);
        expect(aggregate.getRegion(RegionId.create("r1"))?.getName()).toBe("Forest");
    });

    it("test_register_region_throws_when_already_exists", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), []);
        aggregate.registerRegion(region);
        expect(() => aggregate.registerRegion(region)).toThrow("Region already registered");
    });

    it("test_register_location_succeeds_when_region_exists", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), ["loc-1"]);
        aggregate.registerRegion(region);
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.create(5, 5, 0), 100);
        aggregate.registerLocation(location);
        expect(aggregate.getAllLocations()).toHaveLength(1);
    });

    it("test_register_location_throws_when_region_not_found", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.origin(), 100);
        expect(() => aggregate.registerLocation(location)).toThrow("Region not found for location");
    });

    it("test_update_npc_presence_arrived_emits_event", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), ["loc-1"]);
        aggregate.registerRegion(region);
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.create(5, 5, 0), 100);
        aggregate.registerLocation(location);
        aggregate.commitEvents();
        aggregate.updateNpcPresence("char-1", LocationId.create("loc-1"), "arrived", 1000);
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        expect(aggregate.getUncommittedEvents()[0].eventType).toBe("EVT_WORLD_NpcPresenceUpdated");
    });

    it("test_update_npc_presence_departed_throws_when_not_present", () => {
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(RegionId.create("r1"), "Forest", "Desc", SpatialCoordinate.origin(), SpatialCoordinate.create(10, 10, 0), ["loc-1"]);
        aggregate.registerRegion(region);
        const location = Location.create(LocationId.create("loc-1"), RegionId.create("r1"), "Village", "Desc", SpatialCoordinate.create(5, 5, 0), 100);
        aggregate.registerLocation(location);
        expect(() => aggregate.updateNpcPresence("char-1", LocationId.create("loc-1"), "departed", 1000)).toThrow("NPC char-1 is not present at location");
    });
});

