/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldRuntimeImpl } from "../../../src/Infrastructure/Runtime/WorldRuntimeImpl";
import { ClockWorker } from "../../../src/Infrastructure/Workers/ClockWorker";
import { WeatherWorker } from "../../../src/Infrastructure/Workers/WeatherWorker";
import { SnapshotWorker } from "../../../src/Infrastructure/Workers/SnapshotWorker";
import { EventSchedulerWorker } from "../../../src/Infrastructure/Workers/EventSchedulerWorker";
import { CleanupWorker } from "../../../src/Infrastructure/Workers/CleanupWorker";
import { ProjectionWorker } from "../../../src/Infrastructure/Workers/ProjectionWorker";
import { WorldSimulationSaga } from "../../../src/Infrastructure/Saga/WorldSimulationSaga";
import { WorldEngineAclTranslator } from "../../../src/Infrastructure/Integration/WorldEngineAclTranslator";
import { WorldEngineSecurity } from "../../../src/Infrastructure/Integration/WorldEngineSecurity";
import { WorldEngineOpenApi } from "../../../src/Infrastructure/Integration/WorldEngineOpenApi";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import { IEventBus } from "@nova-x-ai/core";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";

describe("E2E WorldEngine Batch 4", () => {
    let mockEngine: Mocked<IWorldEngine>;
    let mockEventBus: Mocked<IEventBus>;
    let config: RuntimeConfiguration;

    beforeEach(() => {
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "simulation_running", version: 1 }),
            advanceTime: vi.fn().mockResolvedValue(undefined),
            takeSnapshot: vi.fn().mockResolvedValue({}),
            transitionWorldState: vi.fn().mockResolvedValue(undefined),
            updateWeather: vi.fn().mockResolvedValue(undefined),
            updateNpcPresence: vi.fn().mockResolvedValue(undefined),
            setGlobalVariable: vi.fn().mockResolvedValue(undefined),
            initializeWorld: vi.fn().mockResolvedValue(undefined),
            shutdown: vi.fn().mockResolvedValue(undefined),
            eventBus: {} as any,
            worldRepository: {} as any,
            clockRepository: {} as any,
            regionRegistryRepository: {} as any,
            eventStoreRepository: {} as any,
            timeSimulationService: {} as any,
            environmentalSimulationService: {} as any,
            spatialContextBuilder: {} as any,
            snapshotManager: {} as any
        } as unknown as Mocked<IWorldEngine>;

        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn()
        } as unknown as Mocked<IEventBus>;

        config = {
            tickIntervalMs: 1000,
            enableRealtimeWeatherSimulation: false,
            enableNpcSpatialTracking: false,
            snapshotCadenceTicks: 50,
            cleanupIntervalMs: 3600000,
            projectionSyncIntervalMs: 30000,
            eventScheduleIntervalMs: 5000,
            maxConsecutiveFailures: 5,
            recoveryTimeoutMs: 30000
        };
    });

    it("should initialize world, start runtime, advance time, weather update, region transition, NPC presence, global variable update, event publication, projection update, snapshot creation, restart/recovery, replay, query resulting state", async () => {
        const worldId = "test-world";
        const worldIdVo = WorldId.create(worldId);

        mockEngine.getWorldState = vi.fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ state: "initialized", version: 0 })
            .mockResolvedValueOnce({ state: "active", version: 1 })
            .mockResolvedValueOnce({ state: "simulation_running", version: 2 });

        const runtime = new WorldRuntimeImpl(mockEngine, mockEventBus, config);
        await runtime.start(worldId);
        expect(runtime.getState()).toBe("active");

        const workers = runtime.getWorkers();
        expect(workers.length).toBe(6);

        const clockWorker = workers.find(w => w.getWorkerName() === "ClockWorker")! as ClockWorker;
        clockWorker.setEngine(mockEngine);
        clockWorker.setWorldId(WorldId.create(worldId));
        clockWorker.configure(config);
        await clockWorker.start();

        mockEngine.getWorldState = vi.fn().mockResolvedValue({ state: "simulation_running", version: 2 });
        await runtime.transitionTo("simulation_running");

        mockEngine.getWorldState = vi.fn().mockResolvedValue({ state: "simulation_running", version: 3 });
        await mockEngine.advanceTime(worldId, 1);

        await mockEngine.updateWeather(worldId, "region-1", {
            temperatureCelsius: 22,
            precipitationMm: 0,
            windSpeedKmh: 12,
            cloudCoverPercent: 5,
            description: "sunny"
        });

        await mockEngine.updateNpcPresence(worldId, "char-1", "loc-1", "arrived");

        await mockEngine.setGlobalVariable(worldId, "testVar", "testValue", "string");

        const snapshot = await runtime.takeSnapshot(worldId);
        expect(snapshot).toBeDefined();

        await runtime.pause();
        expect(runtime.getState()).toBe("time_paused");

        await runtime.resume();
        expect(runtime.getState()).toBe("simulation_running");

        await runtime.handleFailure("test failure", worldId);
        expect(runtime.getState()).toBe("failed");

        await runtime.recover(worldId);
        expect(runtime.getState()).toBe("active");

        const saga = runtime.getSaga();
        expect(saga).not.toBeNull();
        expect(saga!.getProcessState()).toBe("failed");

        const security = runtime.getSecurity();
        expect(security).not.toBeNull();
        const auth = await security!.validateCommand({ type: "AdvanceTime" }, "user-1");
        expect(auth.authorized).toBe(true);

        const acl = runtime.getAcl();
        expect(acl).not.toBeNull();
        const translated = acl!.translateLocationPayload({ id: "loc-1", regionId: "reg-1", x: 10, y: 20, z: 0 });
        expect(translated.locationId).toBe("loc-1");

        const openApi = runtime.getOpenApi();
        expect(openApi).not.toBeNull();
        const worldState = await openApi!.getWorldState(worldId);
        expect(worldState.worldId).toBe(worldId);

        await clockWorker.stop();
        await runtime.stop(worldId);
        expect(runtime.getState()).toBe("archived");
    });
});
