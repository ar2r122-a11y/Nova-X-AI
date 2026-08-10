/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldRuntimeImpl } from "../../../src/Infrastructure/Runtime/WorldRuntimeImpl";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime/index";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";

describe("WorldRuntime", () => {
    let mockEngine: Mocked<IWorldEngine>;
    let mockEventBus: Mocked<import("@nova-x-ai/core").IEventBus>;
    let config: RuntimeConfiguration;
    let runtime: WorldRuntimeImpl;

    beforeEach(() => {
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "active", version: 1 }),
            advanceTime: vi.fn().mockResolvedValue(undefined),
            takeSnapshot: vi.fn().mockResolvedValue({}),
            transitionWorldState: vi.fn().mockResolvedValue(undefined),
            shutdown: vi.fn().mockResolvedValue(undefined),
            eventBus: {} as import("@nova-x-ai/core").IEventBus,
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
        } as unknown as Mocked<import("@nova-x-ai/core").IEventBus>;

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

        runtime = new WorldRuntimeImpl(mockEngine, mockEventBus, config);
    });

    describe("startup", () => {
        it("should start and transition to active", async () => {
            await runtime.start("test-world");
            expect(runtime.getState()).toBe("active");
        });

        it("should initialize workers", async () => {
            await runtime.start("test-world");
            const workers = runtime.getWorkers();
            expect(workers.length).toBe(6);
            const names = workers.map(w => w.getWorkerName());
            expect(names).toContain("ClockWorker");
            expect(names).toContain("WeatherWorker");
            expect(names).toContain("SnapshotWorker");
            expect(names).toContain("EventSchedulerWorker");
            expect(names).toContain("CleanupWorker");
            expect(names).toContain("ProjectionWorker");
        });

        it("should expose health checks", async () => {
            await runtime.start("test-world");
            const healthChecks = runtime.getHealthChecks();
            expect(healthChecks.length).toBeGreaterThan(0);
        });
    });

    describe("shutdown", () => {
        it("should stop workers and transition to archived", async () => {
            await runtime.start("test-world");
            await runtime.stop("test-world");
            expect(runtime.getState()).toBe("archived");
        });

        it("should stop all workers", async () => {
            await runtime.start("test-world");
            const workers = runtime.getWorkers();
            const stopPromises = workers.map(w => w.stop());
            await Promise.all(stopPromises);
            workers.forEach(w => expect(w.isRunning()).toBe(false));
        });
    });

    describe("state transitions", () => {
        it("should allow pause and resume", async () => {
            await runtime.start("test-world");
            await runtime.pause();
            expect(runtime.getState()).toBe("time_paused");
            await runtime.resume();
            expect(runtime.getState()).toBe("simulation_running");
        });

        it("should reject invalid transitions", async () => {
            await runtime.start("test-world");
            expect(runtime.getState()).toBe("active");
            await expect(runtime.transitionTo("recovering" as any)).rejects.toThrow("Invalid runtime state transition");
        });

        it("should track tick count", async () => {
            await runtime.start("test-world");
            runtime.incrementTick();
            runtime.incrementTick();
            expect(runtime.getTickCount()).toBe(2);
        });

        it("should track uptime", async () => {
            await runtime.start("test-world");
            const uptime = runtime.getUptimeMs();
            expect(uptime).toBeGreaterThanOrEqual(0);
        });
    });

    describe("failure and recovery", () => {
        it("should handle failure and transition to failed", async () => {
            await runtime.start("test-world");
            await runtime.handleFailure("test failure", "test-world");
            expect(runtime.getState()).toBe("failed");
        });

        it("should recover from failed state", async () => {
            await runtime.start("test-world");
            await runtime.handleFailure("test failure", "test-world");
            expect(runtime.getState()).toBe("failed");
            await runtime.recover("test-world");
            expect(runtime.getState()).toBe("active");
        });

        it("should not allow operations when archived", async () => {
            await runtime.start("test-world");
            await runtime.stop("test-world");
            expect(runtime.getState()).toBe("archived");
        });
    });

    describe("configuration", () => {
        it("should expose configuration", async () => {
            await runtime.start("test-world");
            const cfg = runtime.getConfiguration();
            expect(cfg.tickIntervalMs).toBe(1000);
            expect(cfg.snapshotCadenceTicks).toBe(50);
        });
    });

    describe("shutdown request", () => {
        it("should track shutdown request", async () => {
            expect(runtime.isShutdownRequested()).toBe(false);
            await runtime.start("test-world");
            await runtime.stop("test-world");
            expect(runtime.isShutdownRequested()).toBe(false);
        });
    });
});
