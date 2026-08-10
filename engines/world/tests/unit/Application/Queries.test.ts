import { describe, it, expect } from "vitest";
import { GetWorldStateQuery } from "../../../src/Application/Queries/GetWorldStateQuery";
import { GetSpatialContextQuery } from "../../../src/Application/Queries/GetSpatialContextQuery";
import { GetWorldClockQuery } from "../../../src/Application/Queries/GetWorldClockQuery";
import { ListRegionLocationsQuery } from "../../../src/Application/Queries/ListRegionLocationsQuery";
import { GetNpcPresenceQuery } from "../../../src/Application/Queries/GetNpcPresenceQuery";

describe("GetWorldStateQuery", () => {
    it("test_query_created_with_correct_properties", () => {
        const query = new GetWorldStateQuery("world-1", "user-1");
        expect(query.worldId).toBe("world-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("test_query_created_without_requester_id", () => {
        const query = new GetWorldStateQuery("world-1");
        expect(query.worldId).toBe("world-1");
        expect(query.requesterId).toBeUndefined();
    });
});

describe("GetSpatialContextQuery", () => {
    it("test_query_created_with_correct_properties", () => {
        const query = new GetSpatialContextQuery("world-1", "loc-1", "user-1");
        expect(query.worldId).toBe("world-1");
        expect(query.locationId).toBe("loc-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("test_query_created_without_requester_id", () => {
        const query = new GetSpatialContextQuery("world-1", "loc-1");
        expect(query.worldId).toBe("world-1");
        expect(query.locationId).toBe("loc-1");
        expect(query.requesterId).toBeUndefined();
    });
});

describe("GetWorldClockQuery", () => {
    it("test_query_created_with_correct_properties", () => {
        const query = new GetWorldClockQuery("world-1", "user-1");
        expect(query.worldId).toBe("world-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("test_query_created_without_requester_id", () => {
        const query = new GetWorldClockQuery("world-1");
        expect(query.worldId).toBe("world-1");
        expect(query.requesterId).toBeUndefined();
    });
});

describe("ListRegionLocationsQuery", () => {
    it("test_query_created_with_correct_properties", () => {
        const query = new ListRegionLocationsQuery("world-1", "region-1", "user-1");
        expect(query.worldId).toBe("world-1");
        expect(query.regionId).toBe("region-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("test_query_created_without_requester_id", () => {
        const query = new ListRegionLocationsQuery("world-1", "region-1");
        expect(query.worldId).toBe("world-1");
        expect(query.regionId).toBe("region-1");
        expect(query.requesterId).toBeUndefined();
    });
});

describe("GetNpcPresenceQuery", () => {
    it("test_query_created_with_correct_properties", () => {
        const query = new GetNpcPresenceQuery("world-1", "loc-1", 1234567890, "user-1");
        expect(query.worldId).toBe("world-1");
        expect(query.locationId).toBe("loc-1");
        expect(query.timestamp).toBe(1234567890);
        expect(query.requesterId).toBe("user-1");
    });

    it("test_query_created_without_optional_fields", () => {
        const query = new GetNpcPresenceQuery("world-1", "loc-1");
        expect(query.worldId).toBe("world-1");
        expect(query.locationId).toBe("loc-1");
        expect(query.timestamp).toBeUndefined();
        expect(query.requesterId).toBeUndefined();
    });
});
