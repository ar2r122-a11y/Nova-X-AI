/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { ProjectionWorker } from "../../../src/Infrastructure/Workers/ProjectionWorker";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("ProjectionWorker", () => {
    let worker: ProjectionWorker;
    let mockEngine: Mocked<IWorldEngine>;
    let config: RuntimeConfiguration;

    beforeEach(() => {
        worker = new ProjectionWorker();
        worker.setWorldId(WorldId.create("test-world"));
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "simulation_running", version: 1 }),
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

    it("should start and stop", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });

    it("should have correct worker name", () => {
        expect(worker.getWorkerName()).toBe("ProjectionWorker");
    });
});
