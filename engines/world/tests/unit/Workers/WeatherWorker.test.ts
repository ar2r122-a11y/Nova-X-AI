/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach, Mocked } from "vitest";
import { WeatherWorker } from "../../../src/Infrastructure/Workers/WeatherWorker";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("WeatherWorker", () => {
    let worker: WeatherWorker;
    let mockEngine: Mocked<IWorldEngine>;
    let config: RuntimeConfiguration;

    beforeEach(() => {
        worker = new WeatherWorker();
        worker.setWorldId(WorldId.create("test-world"));
        worker.setTickInterval(10);
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "simulation_running", version: 1 }),
            transitionWorldState: vi.fn().mockResolvedValue(undefined),
            updateWeather: vi.fn().mockResolvedValue(undefined),
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

    afterEach(async () => {
        await worker.stop();
    });

    it("should start and stop", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });

    it("should not run when feature flag is disabled", async () => {
        config = { ...config, enableRealtimeWeatherSimulation: false };
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.updateWeather).not.toHaveBeenCalled();
        expect(mockEngine.transitionWorldState).not.toHaveBeenCalled();
        await worker.stop();
    });

    it("should update weather when feature flag is enabled", async () => {
        config = { ...config, enableRealtimeWeatherSimulation: true };
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.transitionWorldState).toHaveBeenCalled();
        await worker.stop();
    });

    it("should have correct worker name", () => {
        expect(worker.getWorkerName()).toBe("WeatherWorker");
    });

    it("should not update weather when world is not simulation_running", async () => {
        config = { ...config, enableRealtimeWeatherSimulation: true };
        mockEngine.getWorldState = vi.fn().mockResolvedValue({ state: "active", version: 1 });
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.transitionWorldState).not.toHaveBeenCalled();
        await worker.stop();
    });
});
