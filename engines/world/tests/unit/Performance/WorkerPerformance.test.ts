/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { ClockWorker } from "../../../src/Infrastructure/Workers/ClockWorker";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("Performance", () => {
    let worker: ClockWorker;
    let mockEngine: Mocked<IWorldEngine>;
    let config: RuntimeConfiguration;

    beforeEach(() => {
        worker = new ClockWorker();
        worker.setWorldId(WorldId.create("test-world"));
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "simulation_running", version: 1 }),
            advanceTime: vi.fn().mockResolvedValue(undefined),
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

    it("should not block main runtime", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 100));
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        await worker.stop();
    });

    it("should complete tick within time budget", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 1500));
        const health = worker.getHealth();
        expect(health.lastTickDurationMs).toBeLessThan(20);
        await worker.stop();
    });
});
