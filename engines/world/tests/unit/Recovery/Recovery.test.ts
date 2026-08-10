/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { RecoveryManager } from "../../../src/Infrastructure/Recovery/RecoveryManager";
import { CircuitBreaker } from "../../../src/Infrastructure/Recovery/CircuitBreaker";
import { EventAppendRetryQueue } from "../../../src/Infrastructure/Recovery/EventAppendRetryQueue";

describe("Recovery", () => {
    describe("RecoveryManager", () => {
        let mockEventStore: Mocked<any>;
        let mockSnapshotStore: Mocked<any>;
        let mockProjectionStore: Mocked<any>;
        let manager: RecoveryManager;

        beforeEach(() => {
            mockEventStore = {
                readAllStreams: vi.fn().mockResolvedValue([]),
                readStream: vi.fn().mockResolvedValue([])
            };
            mockSnapshotStore = {
                getAllSnapshots: vi.fn().mockResolvedValue([]),
                deleteSnapshot: vi.fn().mockResolvedValue(undefined)
            };
            mockProjectionStore = {
                listProjections: vi.fn().mockResolvedValue([]),
                resetProjection: vi.fn().mockResolvedValue(undefined)
            };

            manager = new RecoveryManager(mockEventStore, mockSnapshotStore, mockProjectionStore);
        });

        it("should recover storage and remove invalid snapshots", async () => {
            mockSnapshotStore.getAllSnapshots = vi.fn().mockResolvedValue([
                { snapshotId: "", streamId: "valid", version: 1, data: {}, checksum: "", createdAt: Date.now(), compressed: false },
                { snapshotId: "snap-1", streamId: "valid-2", version: 1, data: {}, checksum: "", createdAt: Date.now(), compressed: false }
            ]);
            await manager.recoverStorage();
            expect(mockSnapshotStore.deleteSnapshot).toHaveBeenCalledWith("");
        });

        it("should rebuild projection", async () => {
            mockProjectionStore.listProjections = vi.fn().mockResolvedValue(["world-1-projection"]);
            await manager.rebuildProjection("world-1");
            expect(mockProjectionStore.resetProjection).toHaveBeenCalledWith("world-1-projection");
        });

        it("should rebuild spatial index", async () => {
            await manager.rebuildSpatialIndex("world-1");
            expect(mockEventStore.readAllStreams).toHaveBeenCalled();
        });

        it("should replay events", async () => {
            mockEventStore.readStream = vi.fn().mockResolvedValue([]);
            await manager.replayEvents("world-1", 0);
            expect(mockEventStore.readStream).toHaveBeenCalledWith("world-1", 0);
        });
    });

    describe("CircuitBreaker", () => {
        it("should start closed", () => {
            const cb = new CircuitBreaker({ failureThreshold: 3, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
            expect(cb.getState()).toBe("closed");
        });

        it("should open after failures", async () => {
            const cb = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
            await expect(cb.execute(async () => { throw new Error("fail"); })).rejects.toThrow();
            await expect(cb.execute(async () => { throw new Error("fail"); })).rejects.toThrow();
            expect(cb.getState()).toBe("open");
        });

        it("should reject calls when open", async () => {
            const cb = new CircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 1000, halfOpenMaxCalls: 1 });
            await expect(cb.execute(async () => { throw new Error("fail"); })).rejects.toThrow();
            await expect(cb.execute(async () => "success")).rejects.toThrow("Circuit breaker is open.");
        });
    });

    describe("EventAppendRetryQueue", () => {
        it("should enqueue events", () => {
            const queue = new EventAppendRetryQueue();
            queue.enqueue({ eventType: "test" });
            expect(queue.pendingCount).toBe(1);
        });

        it("should process events", async () => {
            const queue = new EventAppendRetryQueue();
            queue.enqueue({ eventType: "test" });
            const processor = vi.fn().mockResolvedValue(undefined);
            await queue.process(processor);
            expect(processor).toHaveBeenCalled();
            expect(queue.pendingCount).toBe(0);
        });

        it("should retry on failure", async () => {
            const queue = new EventAppendRetryQueue(10, 100, 2);
            queue.enqueue({ eventType: "test" });
            let callCount = 0;
            const processor = vi.fn().mockImplementation(async () => {
                callCount++;
                if (callCount < 2) throw new Error("fail");
            });
            vi.useFakeTimers();
            await queue.process(processor);
            vi.advanceTimersByTime(20);
            await queue.process(processor);
            expect(callCount).toBe(2);
            vi.useRealTimers();
        });

        it("should clear queue", () => {
            const queue = new EventAppendRetryQueue();
            queue.enqueue({ eventType: "test" });
            queue.clear();
            expect(queue.pendingCount).toBe(0);
        });
    });
});
