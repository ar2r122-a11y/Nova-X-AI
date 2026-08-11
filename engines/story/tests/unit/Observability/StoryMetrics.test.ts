import { describe, test, expect, vi } from "vitest";
import { StoryMetrics } from "../../../src/Infrastructure/Observability/StoryMetrics";

describe("StoryMetrics", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const metrics = new StoryMetrics(mockEventBus);

    test("records scene transition duration", () => {
        metrics.recordSceneTransition(42);
        const result = metrics.getMetrics();
        expect(result.sceneTransitionDurations).toContain(42);
    });

    test("records event store append count", () => {
        metrics.recordEventStoreAppend();
        metrics.recordEventStoreAppend();
        const result = metrics.getMetrics();
        expect(result.eventStoreAppendCount).toBe(2);
    });

    test("records projection lag", () => {
        metrics.recordProjectionLag(150);
        const result = metrics.getMetrics();
        expect(result.projectionLagMs).toBe(150);
    });

    test("records worker health", () => {
        metrics.recordWorkerHealth("worker-1", "Running");
        const result = metrics.getMetrics();
        expect(result.workerHealth["worker-1"]).toBe("Running");
    });

    test("records story progression", () => {
        metrics.recordStoryProgression("story-1", 75);
        const result = metrics.getMetrics();
        expect(result.storyProgressionStats["story-1"]).toBe(75);
    });
});
