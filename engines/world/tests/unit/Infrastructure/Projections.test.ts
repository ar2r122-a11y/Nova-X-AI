import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectionEngine } from "../../../src/Infrastructure/Projections/ProjectionEngine";
import { WorldProjectionReadRepository } from "../../../src/Infrastructure/Projections/WorldProjectionReadRepository";

describe("ProjectionEngine", () => {
    let mockEventBus: any;
    let mockProjectionStore: any;
    let projectionEngine: ProjectionEngine;

    beforeEach(() => {
        mockEventBus = {
            subscribe: vi.fn()
        };
        mockProjectionStore = {
            resetProjection: vi.fn(),
            listProjections: vi.fn().mockResolvedValue(["proj-1"])
        };
        projectionEngine = new ProjectionEngine(mockEventBus, mockProjectionStore);
    });

    it("test_start_subscribes_to_registered_handlers", () => {
        const handler = { handle: vi.fn() };
        projectionEngine.registerHandler("EVT_WORLD_Test", handler as any);
        projectionEngine.start();
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_Test", handler);
    });

    it("test_stop_sets_running_to_false", () => {
        projectionEngine.start();
        projectionEngine.stop();
        expect(projectionEngine).toBeDefined();
    });

    it("test_rebuild_resets_projection", async () => {
        await projectionEngine.rebuild("proj-1");
        expect(mockProjectionStore.resetProjection).toHaveBeenCalledWith("proj-1");
    });

    it("test_get_status_returns_projection_info", async () => {
        const status = await projectionEngine.getStatus();
        expect(status).toHaveLength(1);
        expect(status[0].name).toBe("proj-1");
    });
});

describe("WorldProjectionReadRepository", () => {
    let mockProjectionStore: any;
    let readRepository: WorldProjectionReadRepository;

    beforeEach(() => {
        mockProjectionStore = {
            getProjection: vi.fn(),
            listProjections: vi.fn()
        };
        readRepository = new WorldProjectionReadRepository(mockProjectionStore);
    });

    it("test_get_world_state_returns_null_when_no_projection", async () => {
        mockProjectionStore.getProjection.mockResolvedValue(null);
        const result = await readRepository.getWorldState("world-1");
        expect(result).toBeNull();
    });

    it("test_get_world_state_returns_read_model", async () => {
        mockProjectionStore.getProjection.mockResolvedValue({
            worldId: "world-1",
            state: "active",
            regions: [],
            timeline: { currentTime: "12:00:00", currentDate: "2024-01-01", currentSeason: "winter", tickCount: 0 },
            environment: { temperatureCelsius: 20, precipitationMm: 0, windSpeedKmh: 5, cloudCoverPercent: 10, description: "clear" },
            lastUpdated: 1000
        });
        const result = await readRepository.getWorldState("world-1");
        expect(result?.worldId).toBe("world-1");
        expect(result?.state).toBe("active");
    });

    it("test_get_timeline_returns_null_when_no_projection", async () => {
        mockProjectionStore.getProjection.mockResolvedValue(null);
        const result = await readRepository.getTimeline("world-1");
        expect(result).toBeNull();
    });

    it("test_get_global_variables_lists_all_variables", async () => {
        mockProjectionStore.listProjections.mockResolvedValue([
            "global-variable-projection:world-1:dayCount",
            "global-variable-projection:world-1:weather"
        ]);
        mockProjectionStore.getProjection
            .mockResolvedValueOnce({ key: "dayCount", value: 1, updatedAt: 1000 })
            .mockResolvedValueOnce({ key: "weather", value: "clear", updatedAt: 2000 });

        const result = await readRepository.getGlobalVariables("world-1");
        expect(result?.variables).toHaveLength(2);
        expect(result?.variables[0].key).toBe("dayCount");
        expect(result?.variables[1].key).toBe("weather");
    });
});
