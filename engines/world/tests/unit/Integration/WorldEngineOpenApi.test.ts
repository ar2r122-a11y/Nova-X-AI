/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldEngineOpenApi } from "../../../src/Infrastructure/Integration/WorldEngineOpenApi";
import type { IWorldEngine } from "../../../src/Contracts/IWorldEngine";

describe("WorldEngineOpenApi", () => {
    let openApi: WorldEngineOpenApi;
    let mockEngine: Mocked<IWorldEngine>;

    beforeEach(() => {
        mockEngine = {
            getWorldState: vi.fn().mockResolvedValue({ state: "simulation_running", version: 42 }),
            takeSnapshot: vi.fn().mockResolvedValue({}),
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

        openApi = new WorldEngineOpenApi(mockEngine);
    });

    describe("getWorldMap", () => {
        it("should return world map", async () => {
            const result = await openApi.getWorldMap("world-1");
            expect(result.worldId).toBe("world-1");
            expect(result.regions.state).toBe("simulation_running");
        });

        it("should return empty regions for unknown world", async () => {
            mockEngine.getWorldState = vi.fn().mockResolvedValue(null);
            const result = await openApi.getWorldMap("unknown");
            expect(result.worldId).toBe("unknown");
            expect(result.regions).toEqual({});
        });
    });

    describe("getTemporalState", () => {
        it("should return temporal state", async () => {
            const result = await openApi.getTemporalState("world-1");
            expect(result.worldId).toBe("world-1");
            expect(result.tickCount).toBe(42);
        });

        it("should return defaults for unknown world", async () => {
            mockEngine.getWorldState = vi.fn().mockResolvedValue(null);
            const result = await openApi.getTemporalState("unknown");
            expect(result.worldId).toBe("unknown");
            expect(result.tickCount).toBe(0);
        });
    });

    describe("getWorldState", () => {
        it("should return world state", async () => {
            const result = await openApi.getWorldState("world-1");
            expect(result.worldId).toBe("world-1");
            expect(result.state).toBe("simulation_running");
            expect(result.version).toBe(42);
        });

        it("should return unknown for missing world", async () => {
            mockEngine.getWorldState = vi.fn().mockResolvedValue(null);
            const result = await openApi.getWorldState("unknown");
            expect(result.state).toBe("unknown");
            expect(result.version).toBe(0);
        });
    });

    describe("getSpatialContext", () => {
        it("should return spatial context", async () => {
            const result = await openApi.getSpatialContext("world-1", "loc-1");
            expect(result.worldId).toBe("world-1");
            expect(result.locationId).toBe("loc-1");
            expect(result.regionId).toBe("unknown");
        });
    });
});
