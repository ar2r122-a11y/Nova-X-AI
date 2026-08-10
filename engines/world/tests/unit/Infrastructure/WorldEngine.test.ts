/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldEngine } from "../../../src/Infrastructure/WorldEngine";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { GlobalVariableKey } from "../../../src/Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../../../src/Domain/ValueObjects/GlobalVariableValue";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldClockAggregate } from "../../../src/Domain/Aggregates/WorldClockAggregate";
import { RegionRegistryAggregate } from "../../../src/Domain/Aggregates/RegionRegistryAggregate";
import { WorldEventStoreAggregate } from "../../../src/Domain/Aggregates/WorldEventStoreAggregate";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";
import { CalendarDate } from "../../../src/Domain/ValueObjects/CalendarDate";
import { SeasonRef } from "../../../src/Domain/ValueObjects/Season";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";
import { WeatherCondition } from "../../../src/Domain/ValueObjects/WeatherCondition";

describe("WorldEngine", () => {
    const mockEventBus = {
        publish: vi.fn().mockResolvedValue(undefined),
        subscribe: vi.fn()
    };

    const mockWorldRepository = {
        save: vi.fn().mockResolvedValue(undefined),
        findById: vi.fn().mockResolvedValue(null)
    };

    const mockClockRepository = {
        save: vi.fn().mockResolvedValue(undefined),
        findByWorldId: vi.fn().mockResolvedValue(null)
    };

    const mockRegionRegistryRepository = {
        save: vi.fn().mockResolvedValue(undefined),
        findByWorldId: vi.fn().mockResolvedValue(null)
    };

    const mockEventStoreRepository = {
        save: vi.fn().mockResolvedValue(undefined),
        findByWorldId: vi.fn().mockResolvedValue(null)
    };

    const mockTimeSimulationService = {};
    const mockEnvironmentalSimulationService = {
        updateWeather: vi.fn().mockResolvedValue(undefined)
    };
    const mockSpatialContextBuilder = {};
    const mockSnapshotManager = {
        takeSnapshot: vi.fn().mockResolvedValue({ version: 1 })
    };

    const engine = new WorldEngine(
        mockEventBus as any,
        mockWorldRepository,
        mockClockRepository,
        mockRegionRegistryRepository,
        mockEventStoreRepository,
        mockTimeSimulationService as any,
        mockEnvironmentalSimulationService as any,
        mockSpatialContextBuilder as any,
        mockSnapshotManager as any
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test_initialize_world_creates_aggregates_saves_and_publishes_event", async () => {
        mockWorldRepository.save.mockResolvedValue(undefined);
        mockClockRepository.save.mockResolvedValue(undefined);
        mockRegionRegistryRepository.save.mockResolvedValue(undefined);
        mockEventStoreRepository.save.mockResolvedValue(undefined);
        await engine.initializeWorld("world-1", "Test World");
        expect(mockWorldRepository.save).toHaveBeenCalledTimes(1);
        expect(mockClockRepository.save).toHaveBeenCalledTimes(1);
        expect(mockRegionRegistryRepository.save).toHaveBeenCalledTimes(1);
        expect(mockEventStoreRepository.save).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = mockEventBus.publish.mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_WORLD_WorldInitialized");
    });

    it("test_advance_time_loads_clock_advances_saves_and_publishes_event", async () => {
        const clockAggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        clockAggregate.commitEvents();
        mockClockRepository.findByWorldId.mockResolvedValue(clockAggregate);
        mockClockRepository.save.mockResolvedValue(undefined);
        await engine.advanceTime("world-1", 3600);
        expect(mockClockRepository.findByWorldId).toHaveBeenCalledWith(WorldId.create("world-1"));
        expect(mockClockRepository.save).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = mockEventBus.publish.mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_WORLD_TimeAdvanced");
    });

    it("test_update_weather_creates_condition_calls_service_and_publishes_event", async () => {
        await engine.updateWeather("world-1", "region-1", {
            temperatureCelsius: 25,
            precipitationMm: 0,
            windSpeedKmh: 10,
            cloudCoverPercent: 20,
            description: "clear"
        });
        expect(mockEnvironmentalSimulationService.updateWeather).toHaveBeenCalledWith("world-1", "region-1", expect.any(WeatherCondition));
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = mockEventBus.publish.mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_WORLD_WeatherChanged");
    });

    it("test_transition_world_state_loads_aggregate_transitions_saves_and_publishes_event", async () => {
        const worldAggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        worldAggregate.commitEvents();
        mockWorldRepository.findById.mockResolvedValue(worldAggregate);
        mockWorldRepository.save.mockResolvedValue(undefined);
        await engine.transitionWorldState("world-1", "active");
        expect(mockWorldRepository.findById).toHaveBeenCalledWith(WorldId.create("world-1"));
        expect(mockWorldRepository.save).toHaveBeenCalledTimes(1);
        expect(mockWorldRepository.save).toHaveBeenCalledWith(worldAggregate);
        expect(worldAggregate.getWorldState().getValue()).toBe("active");
    });

    it("test_update_npc_presence_loads_registry_updates_saves_and_publishes_event", async () => {
        const regionRegistry = RegionRegistryAggregate.create(WorldId.create("world-1"));
        const region = {
            getId: () => RegionId.create("region-1"),
            getName: () => "Region",
            getDescription: () => "Desc",
            getBoundsMin: () => ({ getX: () => 0, getY: () => 0, getZ: () => 0 }),
            getBoundsMax: () => ({ getX: () => 100, getY: () => 100, getZ: () => 0 }),
            getLocationIds: () => ["loc-1"],
            getCreatedAt: () => Date.now(),
            containsCoordinate: () => false,
            hasLocation: () => true
        } as any;
        regionRegistry.registerRegion(region);
        const location = {
            getId: () => LocationId.create("loc-1"),
            getRegionId: () => RegionId.create("region-1"),
            getName: () => "Loc",
            getDescription: () => "Desc",
            getCoordinate: () => ({ getX: () => 50, getY: () => 50, getZ: () => 0 }),
            getCapacity: () => 10
        } as any;
        regionRegistry.registerLocation(location);
        regionRegistry.commitEvents();
        mockRegionRegistryRepository.findByWorldId.mockResolvedValue(regionRegistry);
        mockRegionRegistryRepository.save.mockResolvedValue(undefined);
        await engine.updateNpcPresence("world-1", "npc-1", "loc-1", "arrived");
        expect(mockRegionRegistryRepository.findByWorldId).toHaveBeenCalledWith(WorldId.create("world-1"));
        expect(mockRegionRegistryRepository.save).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = mockEventBus.publish.mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_WORLD_NpcPresenceUpdated");
    });

    it("test_set_global_variable_loads_aggregate_sets_saves_and_publishes_event", async () => {
        const worldAggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        worldAggregate.commitEvents();
        mockWorldRepository.findById.mockResolvedValue(worldAggregate);
        mockWorldRepository.save.mockResolvedValue(undefined);
        await engine.setGlobalVariable("world-1", "dayCount", 1, "number");
        expect(mockWorldRepository.findById).toHaveBeenCalledWith(WorldId.create("world-1"));
        expect(mockWorldRepository.save).toHaveBeenCalledTimes(1);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
        const publishedEvent = mockEventBus.publish.mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_WORLD_GlobalVariableUpdated");
    });

    it("test_take_snapshot_delegates_to_snapshot_manager", async () => {
        mockSnapshotManager.takeSnapshot.mockResolvedValue({ version: 1 });
        const result = await engine.takeSnapshot("world-1");
        expect(mockSnapshotManager.takeSnapshot).toHaveBeenCalledWith("world-1");
        expect(result).toEqual({ version: 1 });
    });

    it("test_get_world_state_returns_null_when_not_found", async () => {
        mockWorldRepository.findById.mockResolvedValue(null);
        const result = await engine.getWorldState("world-1");
        expect(result).toBeNull();
    });

    it("test_get_world_state_returns_state_and_version_when_found", async () => {
        const worldAggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        worldAggregate.commitEvents();
        worldAggregate.activate();
        worldAggregate.commitEvents();
        mockWorldRepository.findById.mockResolvedValue(worldAggregate);
        const result = await engine.getWorldState("world-1");
        expect(result).not.toBeNull();
        expect(result!.state).toBe("active");
        expect(result!.version).toBe(1);
    });

    it("test_shutdown_completes_gracefully", async () => {
        await expect(engine.shutdown()).resolves.toBeUndefined();
    });
});
