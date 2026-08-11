import { describe, test, expect, vi } from "vitest";
import { StoryHealthChecks } from "../../../src/Infrastructure/Health/StoryHealthChecks";

describe("StoryHealthChecks", () => {
    test("returns health status", async () => {
        const mockEventBus = { publish: vi.fn() } as any;
        const mockStoryRepository = { getAll: vi.fn().mockResolvedValue([]) } as any;
        const mockEventStoreRepository = { getStreamVersion: vi.fn().mockResolvedValue(0) } as any;
        const mockProjectionEngine = { getStatus: vi.fn().mockResolvedValue([]) } as any;
        const mockRuntime = { getRuntimeState: () => "active" } as any;
        const mockWorkerLifecycleManager = { getWorkerHealth: () => ({}) } as any;

        const healthChecks = new StoryHealthChecks(
            mockEventBus,
            mockStoryRepository,
            mockEventStoreRepository,
            mockProjectionEngine,
            mockRuntime,
            mockWorkerLifecycleManager
        );

        const status = await healthChecks.checkHealth();
        expect(status.overall).toBe("healthy");
        expect(status.checks.length).toBeGreaterThan(0);
    });
});
