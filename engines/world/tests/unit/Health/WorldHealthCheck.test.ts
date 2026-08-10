/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldHealthCheck } from "../../../src/Infrastructure/Health/WorldHealthCheck";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";
import type { IWorldWorker } from "../../../src/Contracts/Workers/IWorldWorker";

describe("WorldHealthCheck", () => {
    let healthCheck: WorldHealthCheck;
    let mockEngine: Mocked<IWorldEngine>;

    beforeEach(() => {
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "active", version: 1 }),
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

        healthCheck = new WorldHealthCheck(mockEngine, []);
    });

    it("should report healthy when world state exists", async () => {
        const result = await healthCheck.check();
        expect(result.healthy).toBe(true);
        expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it("should report unhealthy when world state is null", async () => {
        mockEngine.getWorldState = vi.fn().mockResolvedValue(null);
        const result = await healthCheck.check();
        expect(result.healthy).toBe(false);
    });

    it("should report unhealthy when engine throws", async () => {
        mockEngine.getWorldState = vi.fn().mockRejectedValue(new Error("DB error"));
        const result = await healthCheck.check();
        expect(result.healthy).toBe(false);
        expect(result.message).toBe("DB error");
    });

    it("should report unhealthy when workers are unhealthy", async () => {
        const unhealthyWorker = {
            getWorkerName: () => "FailingWorker",
            getHealth: () => ({
                workerName: "FailingWorker",
                isRunning: true,
                lastTickDurationMs: 100,
                failureCount: 10,
                lastError: "error",
                status: "unhealthy" as const
            })
        } as unknown as IWorldWorker;

        const check = new WorldHealthCheck(mockEngine, [unhealthyWorker]);
        const result = await check.check();
        expect(result.healthy).toBe(false);
    });

    it("should have correct name", () => {
        expect(healthCheck.name).toBe("WorldEngineHealthCheck");
    });
});
