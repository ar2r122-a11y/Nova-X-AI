/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach, Mocked } from "vitest";
import { ClockWorker } from "../../../src/Infrastructure/Workers/ClockWorker";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("ClockWorker", () => {
    let worker: ClockWorker;
    let mockEngine: Mocked<IWorldEngine>;
    let config: RuntimeConfiguration;

    beforeEach(() => {
        worker = new ClockWorker();
        worker.setWorldId(WorldId.create("test-world"));
        worker.setTickInterval(10);
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

    afterEach(async () => {
        await worker.stop();
    });

    it("should start and stop", async () => {
        expect(worker.isRunning()).toBe(false);
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });

    it("should not start twice", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    it("should have correct worker name", () => {
        expect(worker.getWorkerName()).toBe("ClockWorker");
    });

    it("should advance time when world is simulation_running", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.advanceTime).toHaveBeenCalledWith("test-world", 1);
    });

    it("should not advance time when world is not simulation_running", async () => {
        mockEngine.getWorldState = vi.fn().mockResolvedValue({ state: "active", version: 1 });
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.advanceTime).not.toHaveBeenCalled();
    });

    it("should support pause and resume", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        await worker.pause();
        expect(worker.isRunning()).toBe(true);
        mockEngine.advanceTime = vi.fn();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.advanceTime).not.toHaveBeenCalled();
        await worker.resume();
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(mockEngine.advanceTime).toHaveBeenCalled();
    });

    it("should report health", async () => {
        worker.setEngine(mockEngine);
        worker.configure(config);
        await worker.start();
        const health = worker.getHealth();
        expect(health.workerName).toBe("ClockWorker");
        expect(health.isRunning).toBe(true);
    });
});
