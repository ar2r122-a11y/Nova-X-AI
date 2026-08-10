import { describe, it, expect, vi } from "vitest";
import { InitializeWorldCommand } from "../../../src/Application/Commands/InitializeWorldCommand";
import { AdvanceTimeCommand } from "../../../src/Application/Commands/AdvanceTimeCommand";
import { UpdateWeatherCommand } from "../../../src/Application/Commands/UpdateWeatherCommand";
import { TransitionRegionCommand } from "../../../src/Application/Commands/TransitionRegionCommand";
import { RegisterNpcPresenceCommand } from "../../../src/Application/Commands/RegisterNpcPresenceCommand";
import { SetGlobalVariableCommand } from "../../../src/Application/Commands/SetGlobalVariableCommand";
import { GetWorldStateQuery } from "../../../src/Application/Queries/GetWorldStateQuery";
import { GetSpatialContextQuery } from "../../../src/Application/Queries/GetSpatialContextQuery";
import { GetWorldClockQuery } from "../../../src/Application/Queries/GetWorldClockQuery";
import { ListRegionLocationsQuery } from "../../../src/Application/Queries/ListRegionLocationsQuery";
import { GetNpcPresenceQuery } from "../../../src/Application/Queries/GetNpcPresenceQuery";
import { InitializeWorldCommandHandler } from "../../../src/Application/Handlers/InitializeWorldCommandHandler";
import { AdvanceTimeCommandHandler } from "../../../src/Application/Handlers/AdvanceTimeCommandHandler";
import { UpdateWeatherCommandHandler } from "../../../src/Application/Handlers/UpdateWeatherCommandHandler";
import { TransitionRegionCommandHandler } from "../../../src/Application/Handlers/TransitionRegionCommandHandler";
import { RegisterNpcPresenceCommandHandler } from "../../../src/Application/Handlers/RegisterNpcPresenceCommandHandler";
import { SetGlobalVariableCommandHandler } from "../../../src/Application/Handlers/SetGlobalVariableCommandHandler";
import { GetWorldStateQueryHandler } from "../../../src/Application/Handlers/GetWorldStateQueryHandler";
import { GetSpatialContextQueryHandler } from "../../../src/Application/Handlers/GetSpatialContextQueryHandler";
import { GetWorldClockQueryHandler } from "../../../src/Application/Handlers/GetWorldClockQueryHandler";
import { ListRegionLocationsQueryHandler } from "../../../src/Application/Handlers/ListRegionLocationsQueryHandler";
import { GetNpcPresenceQueryHandler } from "../../../src/Application/Handlers/GetNpcPresenceQueryHandler";
import { WorldAggregateDto } from "../../../src/Application/DTO/WorldAggregateDto";
import { SpatialContextDto } from "../../../src/Application/DTO/SpatialContextDto";
import { WorldTimelineDto } from "../../../src/Application/DTO/WorldTimelineDto";
import { RegionLocationsQueryResultDto } from "../../../src/Application/DTO/RegionLocationsQueryResultDto";
import { NpcPresenceQueryResultDto } from "../../../src/Application/DTO/NpcPresenceQueryResultDto";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldClockAggregate } from "../../../src/Domain/Aggregates/WorldClockAggregate";
import { RegionRegistryAggregate } from "../../../src/Domain/Aggregates/RegionRegistryAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";
import { EnvironmentConditions } from "../../../src/Domain/ValueObjects/EnvironmentConditions";
import { WeatherCondition } from "../../../src/Domain/ValueObjects/WeatherCondition";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";
import { CalendarDate } from "../../../src/Domain/ValueObjects/CalendarDate";
import { SeasonRef } from "../../../src/Domain/ValueObjects/Season";
import { Region } from "../../../src/Domain/Entities/Region";
import { Location } from "../../../src/Domain/Entities/Location";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";
import { SpatialCoordinate } from "../../../src/Domain/ValueObjects/SpatialCoordinate";
import { NpcPresenceEntry } from "../../../src/Domain/Entities/NpcPresenceEntry";

describe("InitializeWorldCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { initializeWorld: vi.fn().mockResolvedValue(undefined), getWorldState: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new InitializeWorldCommandHandler(worldEngine, eventBus);
        const command = new InitializeWorldCommand("world-1", "Test World", { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.initializeWorld).toHaveBeenCalledWith("world-1", "Test World");
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { initializeWorld: vi.fn(), getWorldState: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new InitializeWorldCommandHandler(worldEngine, eventBus);
        const command = new InitializeWorldCommand("world-1", "Test World", { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("AdvanceTimeCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { advanceTime: vi.fn().mockResolvedValue(undefined) } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new AdvanceTimeCommandHandler(worldEngine, eventBus);
        const command = new AdvanceTimeCommand("world-1", 3600, { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.advanceTime).toHaveBeenCalledWith("world-1", 3600);
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { advanceTime: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new AdvanceTimeCommandHandler(worldEngine, eventBus);
        const command = new AdvanceTimeCommand("world-1", 3600, { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("UpdateWeatherCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { updateWeather: vi.fn().mockResolvedValue(undefined) } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new UpdateWeatherCommandHandler(worldEngine, eventBus);
        const conditions = {
            temperatureCelsius: 22,
            precipitationMm: 5,
            windSpeedKmh: 15,
            cloudCoverPercent: 80,
            description: "rainy"
        };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.updateWeather).toHaveBeenCalledWith("world-1", "region-1", conditions);
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { updateWeather: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new UpdateWeatherCommandHandler(worldEngine, eventBus);
        const conditions = {
            temperatureCelsius: 22,
            precipitationMm: 5,
            windSpeedKmh: 15,
            cloudCoverPercent: 80,
            description: "rainy"
        };
        const command = new UpdateWeatherCommand("world-1", "region-1", conditions, { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("TransitionRegionCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { transitionWorldState: vi.fn().mockResolvedValue(undefined), getWorldState: vi.fn().mockResolvedValue({ state: "active", version: 1 }) } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new TransitionRegionCommandHandler(worldEngine, eventBus);
        const command = new TransitionRegionCommand("world-1", "region-1", "active", { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.transitionWorldState).toHaveBeenCalledWith("world-1", "active");
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { transitionWorldState: vi.fn(), getWorldState: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new TransitionRegionCommandHandler(worldEngine, eventBus);
        const command = new TransitionRegionCommand("world-1", "region-1", "active", { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("RegisterNpcPresenceCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { updateNpcPresence: vi.fn().mockResolvedValue(undefined) } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new RegisterNpcPresenceCommandHandler(worldEngine, eventBus);
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "arrived", { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.updateNpcPresence).toHaveBeenCalledWith("world-1", "char-1", "loc-1", "arrived");
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { updateNpcPresence: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new RegisterNpcPresenceCommandHandler(worldEngine, eventBus);
        const command = new RegisterNpcPresenceCommand("world-1", "char-1", "loc-1", "arrived", { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("SetGlobalVariableCommandHandler", () => {
    it("test_handle_calls_validator_and_engine", async () => {
        const worldEngine = { setGlobalVariable: vi.fn().mockResolvedValue(undefined), getWorldState: vi.fn().mockResolvedValue({ state: "active", version: 1 }) } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new SetGlobalVariableCommandHandler(worldEngine, eventBus);
        const command = new SetGlobalVariableCommand("world-1", "dayCount", 5, "number", { roles: ["admin"], permissions: [] });

        await handler.handle(command);

        expect(worldEngine.setGlobalVariable).toHaveBeenCalledWith("world-1", "dayCount", 5, "number");
    });

    it("test_handle_throws_when_no_roles", async () => {
        const worldEngine = { setGlobalVariable: vi.fn(), getWorldState: vi.fn() } as any;
        const eventBus = { publish: vi.fn() } as any;
        const handler = new SetGlobalVariableCommandHandler(worldEngine, eventBus);
        const command = new SetGlobalVariableCommand("world-1", "dayCount", 5, "number", { roles: [], permissions: [] });

        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
    });
});

describe("GetWorldStateQueryHandler", () => {
    it("test_handle_returns_world_aggregate_dto", async () => {
        const aggregate = WorldAggregate.reconstitute(
            WorldId.create("world-1"),
            WorldStateRef.active(),
            [RegionId.create("region-1")],
            new Map(),
            [],
            WorldEventVersion.create(1)
        );
        const worldRepository = { findById: vi.fn().mockResolvedValue(aggregate) } as any;
        const handler = new GetWorldStateQueryHandler(worldRepository);
        const query = new GetWorldStateQuery("world-1");

        const result = await handler.handle(query);

        expect(result).toBeInstanceOf(WorldAggregateDto);
        expect(result.worldId).toBe("world-1");
    });

    it("test_handle_throws_when_world_not_found", async () => {
        const worldRepository = { findById: vi.fn().mockResolvedValue(null) } as any;
        const handler = new GetWorldStateQueryHandler(worldRepository);
        const query = new GetWorldStateQuery("world-1");

        await expect(handler.handle(query)).rejects.toThrow("World not found: world-1");
    });
});

describe("GetSpatialContextQueryHandler", () => {
    it("test_handle_returns_spatial_context_dto", async () => {
        const environment = EnvironmentConditions.create(
            WeatherCondition.clear(),
            TimeOfDay.noon(),
            SeasonRef.summer(),
            10.0,
            0.8
        );
        const spatialContextBuilder = {
            buildContext: vi.fn().mockResolvedValue({
                locationId: "loc-1",
                regionId: "region-1",
                presentNpcs: ["char-1"],
                environment
            })
        } as any;
        const handler = new GetSpatialContextQueryHandler(spatialContextBuilder);
        const query = new GetSpatialContextQuery("world-1", "loc-1");

        const result = await handler.handle(query);

        expect(result).toBeInstanceOf(SpatialContextDto);
        expect(result.locationId).toBe("loc-1");
        expect(result.regionId).toBe("region-1");
    });
});

describe("GetWorldClockQueryHandler", () => {
    it("test_handle_returns_world_timeline_dto", async () => {
        const clock = WorldClockAggregate.reconstitute(
            WorldId.create("world-1"),
            TimeOfDay.noon(),
            CalendarDate.create(2024, 1, 15),
            SeasonRef.summer(),
            0,
            WorldEventVersion.create(1)
        );
        const clockRepository = { findByWorldId: vi.fn().mockResolvedValue(clock) } as any;
        const handler = new GetWorldClockQueryHandler(clockRepository);
        const query = new GetWorldClockQuery("world-1");

        const result = await handler.handle(query);

        expect(result).toBeInstanceOf(WorldTimelineDto);
        expect(result.tickCount).toBe(0);
    });

    it("test_handle_throws_when_world_clock_not_found", async () => {
        const clockRepository = { findByWorldId: vi.fn().mockResolvedValue(null) } as any;
        const handler = new GetWorldClockQueryHandler(clockRepository);
        const query = new GetWorldClockQuery("world-1");

        await expect(handler.handle(query)).rejects.toThrow("World clock not found: world-1");
    });
});

describe("ListRegionLocationsQueryHandler", () => {
    it("test_handle_returns_region_locations_query_result_dto", async () => {
        const region = Region.create(
            RegionId.create("region-1"),
            "Test Region",
            "A test region",
            SpatialCoordinate.create(-10, -10, -10),
            SpatialCoordinate.create(10, 10, 10),
            ["loc-1"]
        );
        const location = Location.create(
            LocationId.create("loc-1"),
            region.getId(),
            "Test Location",
            "A test location",
            SpatialCoordinate.create(0, 0, 0),
            10
        );
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        aggregate.registerRegion(region);
        aggregate.registerLocation(location);
        const regionRegistryRepository = { findByWorldId: vi.fn().mockResolvedValue(aggregate) } as any;
        const handler = new ListRegionLocationsQueryHandler(regionRegistryRepository);
        const query = new ListRegionLocationsQuery("world-1", "region-1");

        const result = await handler.handle(query);

        expect(result).toBeInstanceOf(RegionLocationsQueryResultDto);
        expect(result.regionId).toBe("region-1");
        expect(result.locations).toHaveLength(1);
    });

    it("test_handle_throws_when_region_registry_not_found", async () => {
        const regionRegistryRepository = { findByWorldId: vi.fn().mockResolvedValue(null) } as any;
        const handler = new ListRegionLocationsQueryHandler(regionRegistryRepository);
        const query = new ListRegionLocationsQuery("world-1", "region-1");

        await expect(handler.handle(query)).rejects.toThrow("Region registry not found: world-1");
    });
});

describe("GetNpcPresenceQueryHandler", () => {
    it("test_handle_returns_npc_presence_query_result_dto", async () => {
        const region = Region.create(
            RegionId.create("region-1"),
            "Test Region",
            "A test region",
            SpatialCoordinate.create(-10, -10, -10),
            SpatialCoordinate.create(10, 10, 10),
            ["loc-1"]
        );
        const location = Location.create(
            LocationId.create("loc-1"),
            region.getId(),
            "Test Location",
            "A test location",
            SpatialCoordinate.create(0, 0, 0),
            10
        );
        const aggregate = RegionRegistryAggregate.create(WorldId.create("world-1"));
        aggregate.registerRegion(region);
        aggregate.registerLocation(location);
        const timestamp = Date.now();
        aggregate.updateNpcPresence("char-1", location.getId(), "arrived", timestamp);
        const regionRegistryRepository = { findByWorldId: vi.fn().mockResolvedValue(aggregate) } as any;
        const handler = new GetNpcPresenceQueryHandler(regionRegistryRepository);
        const query = new GetNpcPresenceQuery("world-1", "loc-1", timestamp);

        const result = await handler.handle(query);

        expect(result).toBeInstanceOf(NpcPresenceQueryResultDto);
        expect(result.locationId).toBe("loc-1");
        expect(result.presentNpcs).toContain("char-1");
    });

    it("test_handle_throws_when_region_registry_not_found", async () => {
        const regionRegistryRepository = { findByWorldId: vi.fn().mockResolvedValue(null) } as any;
        const handler = new GetNpcPresenceQueryHandler(regionRegistryRepository);
        const query = new GetNpcPresenceQuery("world-1", "loc-1");

        await expect(handler.handle(query)).rejects.toThrow("Region registry not found: world-1");
    });
});
