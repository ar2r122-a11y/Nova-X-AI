import { describe, it, expect, vi, beforeEach } from "vitest";
import { CircuitBreaker, CircuitBreakerState } from "../../../src/Infrastructure/Recovery/CircuitBreaker";
import { EventAppendRetryQueue } from "../../../src/Infrastructure/Recovery/EventAppendRetryQueue";
import { RecoveryManager } from "../../../src/Infrastructure/Recovery/RecoveryManager";

describe("CircuitBreaker", () => {
    it("test_closed_state_allows_execution", async () => {
        const breaker = new CircuitBreaker({ failureThreshold: 3, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
        const result = await breaker.execute(() => Promise.resolve("success"));
        expect(result).toBe("success");
        expect(breaker.getState()).toBe(CircuitBreakerState.Closed);
    });

    it("test_opens_after_failure_threshold", async () => {
        const breaker = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
        await expect(breaker.execute(() => Promise.reject(new Error("fail")))).rejects.toThrow("fail");
        await expect(breaker.execute(() => Promise.reject(new Error("fail")))).rejects.toThrow("fail");
        expect(breaker.getState()).toBe(CircuitBreakerState.Open);
    });

    it("test_rejects_when_open", async () => {
        const breaker = new CircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
        await expect(breaker.execute(() => Promise.reject(new Error("fail")))).rejects.toThrow("fail");
        await expect(breaker.execute(() => Promise.resolve("success"))).rejects.toThrow("Circuit breaker is open.");
    });

    it("test_half_open_allows_trial_after_timeout", async () => {
        const breaker = new CircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 100, halfOpenMaxCalls: 1 });
        await expect(breaker.execute(() => Promise.reject(new Error("fail")))).rejects.toThrow("fail");
        expect(breaker.getState()).toBe(CircuitBreakerState.Open);

        vi.useFakeTimers();
        await vi.advanceTimersByTimeAsync(200);

        const result = await breaker.execute(() => Promise.resolve("success"));
        expect(result).toBe("success");
        expect(breaker.getState()).toBe(CircuitBreakerState.Closed);
        vi.useRealTimers();
    });
});

describe("EventAppendRetryQueue", () => {
    it("test_enqueue_adds_event", () => {
        const queue = new EventAppendRetryQueue();
        queue.enqueue({ eventType: "EVT_WORLD_Test" });
        expect(queue.pendingCount).toBe(1);
    });

    it("test_process_succeeds_on_first_attempt", async () => {
        const queue = new EventAppendRetryQueue();
        queue.enqueue({ eventType: "EVT_WORLD_Test" });
        const processor = vi.fn().mockResolvedValue(undefined);
        await queue.process(processor);
        expect(processor).toHaveBeenCalledTimes(1);
        expect(queue.pendingCount).toBe(0);
    });

    it("test_process_retries_on_failure", async () => {
        const queue = new EventAppendRetryQueue(100, 1000, 3);
        queue.enqueue({ eventType: "EVT_WORLD_Test" });
        const processor = vi.fn()
            .mockRejectedValueOnce(new Error("fail"))
            .mockResolvedValueOnce(undefined);

        vi.useFakeTimers();
        await queue.process(processor);
        await vi.advanceTimersByTimeAsync(200);
        await queue.process(processor);
        expect(processor).toHaveBeenCalledTimes(2);
        expect(queue.pendingCount).toBe(0);
        vi.useRealTimers();
    });

    it("test_process_throws_after_max_attempts", async () => {
        const queue = new EventAppendRetryQueue(100, 1000, 2);
        queue.enqueue({ eventType: "EVT_WORLD_Test" });
        const processor = vi.fn().mockRejectedValue(new Error("fail"));

        vi.useFakeTimers();
        await queue.process(processor);
        await vi.advanceTimersByTimeAsync(200);
        await expect(queue.process(processor)).rejects.toThrow("Event failed after 2 attempts.");
        vi.useRealTimers();
    });

    it("test_clear_removes_all_events", () => {
        const queue = new EventAppendRetryQueue();
        queue.enqueue({ eventType: "EVT_WORLD_Test1" });
        queue.enqueue({ eventType: "EVT_WORLD_Test2" });
        queue.clear();
        expect(queue.pendingCount).toBe(0);
    });
});

describe("RecoveryManager", () => {
    let mockEventStore: any;
    let mockSnapshotStore: any;
    let mockProjectionStore: any;
    let recoveryManager: RecoveryManager;

    beforeEach(() => {
        mockEventStore = {
            readStream: vi.fn(),
            readAllStreams: vi.fn()
        };
        mockSnapshotStore = {
            getAllSnapshots: vi.fn(),
            deleteSnapshot: vi.fn()
        };
        mockProjectionStore = {
            listProjections: vi.fn(),
            resetProjection: vi.fn()
        };
        recoveryManager = new RecoveryManager(mockEventStore, mockSnapshotStore, mockProjectionStore);
    });

    it("test_recover_storage_removes_invalid_snapshots", async () => {
        mockSnapshotStore.getAllSnapshots.mockResolvedValue([
            { snapshotId: "", streamId: "", version: 1, data: null, checksum: "", createdAt: 1000, compressed: false }
        ]);
        await recoveryManager.recoverStorage();
        expect(mockSnapshotStore.deleteSnapshot).toHaveBeenCalled();
    });

    it("test_rebuild_projection_resets_matching_projections", async () => {
        mockProjectionStore.listProjections.mockResolvedValue(["world-state-projection:world-1", "other-projection"]);
        await recoveryManager.rebuildProjection("world-1");
        expect(mockProjectionStore.resetProjection).toHaveBeenCalledWith("world-state-projection:world-1");
    });

    it("test_replay_events_enqueues_and_processes", async () => {
        mockEventStore.readStream.mockResolvedValue([
            {
                eventId: "1",
                streamId: "world-1",
                eventType: "EVT_WORLD_Test",
                data: {},
                version: 1,
                timestamp: 1000,
                correlationId: "corr-1",
                checksum: "sha256-abc"
            }
        ]);
        await recoveryManager.replayEvents("world-1", 0);
        expect(mockEventStore.readStream).toHaveBeenCalledWith("world-1", 0);
    });
});
