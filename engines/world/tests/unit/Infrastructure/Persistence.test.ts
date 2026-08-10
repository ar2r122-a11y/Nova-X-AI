/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldRepositoryImpl } from "../../../src/Infrastructure/Persistence/WorldRepositoryImpl";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { GlobalVariableKey } from "../../../src/Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../../../src/Domain/ValueObjects/GlobalVariableValue";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";

describe("WorldRepositoryImpl", () => {
    const mockStorageEngine = {
        getRepository: vi.fn()
    };

    const mockRepo = {
        getById: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
        getAll: vi.fn()
    };

    beforeEach(() => {
        mockStorageEngine.getRepository.mockReturnValue(mockRepo);
        mockRepo.getById.mockClear();
        mockRepo.save.mockClear();
    });

    it("test_find_by_id_returns_null_for_missing_entity", async () => {
        mockRepo.getById.mockResolvedValue(null);
        const repository = new WorldRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findById(WorldId.create("world-1"));
        expect(result).toBeNull();
        expect(mockRepo.getById).toHaveBeenCalledWith("world-1");
    });

    it("test_save_serializes_correctly", async () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        mockRepo.save.mockResolvedValue(undefined);
        const repository = new WorldRepositoryImpl(mockStorageEngine as any);
        await repository.save(aggregate);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        const savedEntity = mockRepo.save.mock.calls[0][0];
        expect(savedEntity.id).toBe("world-1");
        const snapshot = JSON.parse(savedEntity.data);
        expect(snapshot.worldId).toBe("world-1");
        expect(snapshot.worldState).toBe("initialized");
        expect(snapshot.version).toBe(0);
    });

    it("test_reconstitute_parses_correctly", async () => {
        const snapshot = {
            worldId: "world-1",
            worldState: "active",
            regionIds: ["region-1", "region-2"],
            globalVariables: [
                { key: "dayCount", value: 5, type: "number" }
            ],
            history: [],
            version: 2
        };
        mockRepo.getById.mockResolvedValue({ id: "world-1", data: JSON.stringify(snapshot) });
        const repository = new WorldRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findById(WorldId.create("world-1"));
        expect(result).not.toBeNull();
        expect(result!.getWorldId().getValue()).toBe("world-1");
        expect(result!.getWorldState().getValue()).toBe("active");
        expect(result!.getVersion().getValue()).toBe(2);
        expect(result!.getGlobalVariables().get("dayCount")!.getValue()).toBe(5);
        expect(result!.getGlobalVariables().get("dayCount")!.getType()).toBe("number");
    });
});

describe("WorldClockRepositoryImpl", () => {
    const mockStorageEngine = {
        getRepository: vi.fn()
    };

    const mockRepo = {
        getById: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
        getAll: vi.fn()
    };

    beforeEach(() => {
        mockStorageEngine.getRepository.mockReturnValue(mockRepo);
        mockRepo.getById.mockClear();
        mockRepo.save.mockClear();
    });

    it("test_find_by_world_id_returns_null_for_missing_entity", async () => {
        mockRepo.getById.mockResolvedValue(null);
        const repository = new (await import("../../../src/Infrastructure/Persistence/WorldClockRepositoryImpl")).WorldClockRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).toBeNull();
        expect(mockRepo.getById).toHaveBeenCalledWith("world-1");
    });

    it("test_save_serializes_correctly", async () => {
        const { WorldClockRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/WorldClockRepositoryImpl");
        const { WorldClockAggregate } = await import("../../../src/Domain/Aggregates/WorldClockAggregate");
        const { TimeOfDay } = await import("../../../src/Domain/ValueObjects/TimeOfDay");
        const { CalendarDate } = await import("../../../src/Domain/ValueObjects/CalendarDate");
        const { SeasonRef } = await import("../../../src/Domain/ValueObjects/Season");
        const aggregate = WorldClockAggregate.reconstitute(
            WorldId.create("world-1"),
            TimeOfDay.create(10, 30, 0),
            CalendarDate.create(2024, 6, 15),
            SeasonRef.summer(),
            5,
            WorldEventVersion.create(2)
        );
        mockRepo.save.mockResolvedValue(undefined);
        const repository = new WorldClockRepositoryImpl(mockStorageEngine as any);
        await repository.save(aggregate);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        const savedEntity = mockRepo.save.mock.calls[0][0];
        expect(savedEntity.id).toBe("world-1");
        const snapshot = JSON.parse(savedEntity.data);
        expect(snapshot.worldId).toBe("world-1");
        expect(snapshot.timeOfDay).toBe("10:30:00");
        expect(snapshot.calendarDate).toBe("2024-06-15");
        expect(snapshot.season).toBe("summer");
        expect(snapshot.tickCount).toBe(5);
        expect(snapshot.version).toBe(2);
    });

    it("test_reconstitute_parses_time_date_season_correctly", async () => {
        const { WorldClockRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/WorldClockRepositoryImpl");
        const { TimeOfDay } = await import("../../../src/Domain/ValueObjects/TimeOfDay");
        const { CalendarDate } = await import("../../../src/Domain/ValueObjects/CalendarDate");
        const { SeasonRef } = await import("../../../src/Domain/ValueObjects/Season");
        const snapshot = {
            worldId: "world-1",
            timeOfDay: "14:45:30",
            calendarDate: "2024-12-25",
            season: "winter",
            tickCount: 10,
            version: 3
        };
        mockRepo.getById.mockResolvedValue({ id: "world-1", data: JSON.stringify(snapshot) });
        const repository = new WorldClockRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).not.toBeNull();
        expect(result!.getTimeOfDay().getTotalSeconds()).toBe(14 * 3600 + 45 * 60 + 30);
        expect(result!.getCalendarDate().toString()).toBe("2024-12-25");
        expect(result!.getSeason().getValue()).toBe("winter");
        expect(result!.getTickCount()).toBe(10);
        expect(result!.getVersion().getValue()).toBe(3);
    });
});

describe("RegionRegistryRepositoryImpl", () => {
    const mockStorageEngine = {
        getRepository: vi.fn()
    };

    const mockRepo = {
        getById: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
        getAll: vi.fn()
    };

    beforeEach(() => {
        mockStorageEngine.getRepository.mockReturnValue(mockRepo);
        mockRepo.getById.mockClear();
        mockRepo.save.mockClear();
    });

    it("test_find_by_world_id_returns_null_for_missing_entity", async () => {
        mockRepo.getById.mockResolvedValue(null);
        const { RegionRegistryRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/RegionRegistryRepositoryImpl");
        const repository = new RegionRegistryRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).toBeNull();
        expect(mockRepo.getById).toHaveBeenCalledWith("world-1");
    });

    it("test_save_serializes_regions_locations_npc_presences", async () => {
        const { RegionRegistryRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/RegionRegistryRepositoryImpl");
        const { RegionRegistryAggregate } = await import("../../../src/Domain/Aggregates/RegionRegistryAggregate");
        const { Region } = await import("../../../src/Domain/Entities/Region");
        const { Location } = await import("../../../src/Domain/Entities/Location");
        const { NpcPresenceEntry } = await import("../../../src/Domain/Entities/NpcPresenceEntry");
        const { SpatialCoordinate } = await import("../../../src/Domain/ValueObjects/SpatialCoordinate");
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = Region.create(
            RegionId.create("region-1"),
            "Forest",
            "A dense forest",
            SpatialCoordinate.origin(),
            SpatialCoordinate.create(100, 100, 0),
            ["loc-1"]
        );
        aggregate.registerRegion(region);
        const location = Location.create(
            LocationId.create("loc-1"),
            RegionId.create("region-1"),
            "Clearing",
            "A small clearing",
            SpatialCoordinate.create(50, 50, 0),
            10
        );
        aggregate.registerLocation(location);
        aggregate.updateNpcPresence("npc-1", location.getId(), "arrived", Date.now());
        mockRepo.save.mockResolvedValue(undefined);
        const repository = new RegionRegistryRepositoryImpl(mockStorageEngine as any);
        await repository.save(aggregate);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        const savedEntity = mockRepo.save.mock.calls[0][0];
        expect(savedEntity.id).toBe("world-1");
        const snapshot = JSON.parse(savedEntity.data);
        expect(snapshot.regions).toHaveLength(1);
        expect(snapshot.regions[0].id).toBe("region-1");
        expect(snapshot.locations).toHaveLength(1);
        expect(snapshot.locations[0].id).toBe("loc-1");
        expect(snapshot.npcPresences).toHaveLength(1);
        expect(snapshot.npcPresences[0].characterId).toBe("npc-1");
    });

    it("test_reconstitute_parses_correctly", async () => {
        const { RegionRegistryRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/RegionRegistryRepositoryImpl");
        const snapshot = {
            worldId: "world-1",
            regions: [
                { id: "region-1", name: "Forest", description: "A dense forest", locationIds: ["loc-1"] }
            ],
            locations: [
                { id: "loc-1", regionId: "region-1", name: "Clearing", description: "A small clearing", coordinate: { x: 50, y: 50, z: 0 }, capacity: 10 }
            ],
            npcPresences: [
                { characterId: "npc-1", entries: [{ locationId: "loc-1", arrivedAt: 1000, scheduledDeparture: null }] }
            ],
            version: 2
        };
        mockRepo.getById.mockResolvedValue({ id: "world-1", data: JSON.stringify(snapshot) });
        const repository = new RegionRegistryRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).not.toBeNull();
        expect(result!.getWorldId().getValue()).toBe("world-1");
        expect(result!.getAllRegions()).toHaveLength(1);
        expect(result!.getAllLocations()).toHaveLength(1);
        expect(result!.getVersion().getValue()).toBe(2);
    });
});

describe("WorldEventStoreRepositoryImpl", () => {
    const mockStorageEngine = {
        getRepository: vi.fn()
    };

    const mockRepo = {
        getById: vi.fn(),
        save: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
        getAll: vi.fn()
    };

    beforeEach(() => {
        mockStorageEngine.getRepository.mockReturnValue(mockRepo);
        mockRepo.getById.mockClear();
        mockRepo.save.mockClear();
    });

    it("test_find_by_world_id_returns_null_for_missing_entity", async () => {
        mockRepo.getById.mockResolvedValue(null);
        const { WorldEventStoreRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/WorldEventStoreRepositoryImpl");
        const repository = new WorldEventStoreRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).toBeNull();
        expect(mockRepo.getById).toHaveBeenCalledWith("world-1");
    });

    it("test_save_serializes_events_and_scheduled_events", async () => {
        const { WorldEventStoreRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/WorldEventStoreRepositoryImpl");
        const { WorldEventStoreAggregate } = await import("../../../src/Domain/Aggregates/WorldEventStoreAggregate");
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        aggregate.appendEvent("TestEvent", { foo: "bar" }, "corr-1");
        aggregate.scheduleEvent("evt-1", "ScheduledEvent", Date.now() + 1000, { key: "value" });
        mockRepo.save.mockResolvedValue(undefined);
        const repository = new WorldEventStoreRepositoryImpl(mockStorageEngine as any);
        await repository.save(aggregate);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        const savedEntity = mockRepo.save.mock.calls[0][0];
        expect(savedEntity.id).toBe("world-1");
        const snapshot = JSON.parse(savedEntity.data);
        expect(snapshot.events).toHaveLength(1);
        expect(snapshot.events[0].eventType).toBe("TestEvent");
        expect(snapshot.scheduledEvents).toHaveLength(1);
        expect(snapshot.scheduledEvents[0].eventId).toBe("evt-1");
    });

    it("test_reconstitute_parses_correctly", async () => {
        const { WorldEventStoreRepositoryImpl } = await import("../../../src/Infrastructure/Persistence/WorldEventStoreRepositoryImpl");
        const snapshot = {
            worldId: "world-1",
            events: [
                { version: 1, eventType: "TestEvent", timestamp: 1000, payload: { foo: "bar" }, correlationId: "corr-1" }
            ],
            scheduledEvents: [
                { eventId: "evt-1", eventType: "ScheduledEvent", triggerTime: 2000, payload: { key: "value" }, executed: false, createdAt: 1500 }
            ],
            version: 2
        };
        mockRepo.getById.mockResolvedValue({ id: "world-1", data: JSON.stringify(snapshot) });
        const repository = new WorldEventStoreRepositoryImpl(mockStorageEngine as any);
        const result = await repository.findByWorldId(WorldId.create("world-1"));
        expect(result).not.toBeNull();
        expect(result!.getWorldId().getValue()).toBe("world-1");
        expect(result!.getVersion().getValue()).toBe(2);
        const events = result!.getEventsFromVersion(WorldEventVersion.initial());
        expect(events).toHaveLength(1);
        expect(events[0].getEventType()).toBe("TestEvent");
        const dueEvents = result!.getDueScheduledEvents(2500);
        expect(dueEvents).toHaveLength(1);
        expect(dueEvents[0].getEventId()).toBe("evt-1");
    });
});

describe("WorldRepositoryFactory", () => {
    it("test_creates_all_four_repositories_with_shared_storage_engine", async () => {
        const { WorldRepositoryFactory } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryFactory");
        const mockStorageEngine = { getRepository: vi.fn() };
        const factory = new WorldRepositoryFactory(mockStorageEngine as any);
        const worldRepo = factory.createWorldRepository();
        const clockRepo = factory.createWorldClockRepository();
        const regionRepo = factory.createRegionRegistryRepository();
        const eventRepo = factory.createWorldEventStoreRepository();
        expect(worldRepo).toBeDefined();
        expect(clockRepo).toBeDefined();
        expect(regionRepo).toBeDefined();
        expect(eventRepo).toBeDefined();
    });
});

describe("WorldRepositoryRegistry", () => {
    it("test_register_and_get_returns_repository", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const registry = new WorldRepositoryRegistry();
        const mockRepo = {} as any;
        registry.register("worlds", mockRepo);
        expect(registry.has("worlds")).toBe(true);
        expect(registry.get("worlds")).toBe(mockRepo);
    });

    it("test_get_returns_undefined_for_unregistered_collection", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const registry = new WorldRepositoryRegistry();
        expect(registry.get("worlds")).toBeUndefined();
    });

    it("test_has_returns_false_for_unregistered_collection", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const registry = new WorldRepositoryRegistry();
        expect(registry.has("worlds")).toBe(false);
    });

    it("test_clear_removes_all_registrations", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const registry = new WorldRepositoryRegistry();
        registry.register("worlds", {} as any);
        registry.register("world-clocks", {} as any);
        registry.clear();
        expect(registry.has("worlds")).toBe(false);
        expect(registry.has("world-clocks")).toBe(false);
    });
});

describe("WorldRepositoryResolver", () => {
    it("test_resolve_methods_throw_when_not_registered", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const { WorldRepositoryResolver } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryResolver");
        const registry = new WorldRepositoryRegistry();
        const resolver = new WorldRepositoryResolver(registry);
        expect(() => resolver.resolveWorldRepository()).toThrow("World repository not registered.");
        expect(() => resolver.resolveWorldClockRepository()).toThrow("World clock repository not registered.");
        expect(() => resolver.resolveRegionRegistryRepository()).toThrow("Region registry repository not registered.");
        expect(() => resolver.resolveWorldEventStoreRepository()).toThrow("World event store repository not registered.");
    });

    it("test_resolve_methods_return_correct_repository", async () => {
        const { WorldRepositoryRegistry } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryRegistry");
        const { WorldRepositoryResolver } = await import("../../../src/Infrastructure/Persistence/WorldRepositoryResolver");
        const registry = new WorldRepositoryRegistry();
        const worldRepo = {} as any;
        const clockRepo = {} as any;
        const regionRepo = {} as any;
        const eventRepo = {} as any;
        registry.register("worlds", worldRepo);
        registry.register("world-clocks", clockRepo);
        registry.register("world-regions", regionRepo);
        registry.register("world-event-stores", eventRepo);
        const resolver = new WorldRepositoryResolver(registry);
        expect(resolver.resolveWorldRepository()).toBe(worldRepo);
        expect(resolver.resolveWorldClockRepository()).toBe(clockRepo);
        expect(resolver.resolveRegionRegistryRepository()).toBe(regionRepo);
        expect(resolver.resolveWorldEventStoreRepository()).toBe(eventRepo);
    });
});
