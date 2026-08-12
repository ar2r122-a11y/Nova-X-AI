import { describe, it, expect, vi, beforeEach } from "vitest";

interface MockSnapshot {
    snapshotId: string;
    streamId: string;
    data: object;
}

interface MockEventStore {
    readStream(streamId: string, fromVersion: number): Promise<any[]>;
}

interface MockSnapshotStore {
    getAllSnapshots(): Promise<MockSnapshot[]>;
    deleteSnapshot(snapshotId: string): Promise<void>;
}

interface MockProjectionStore {
    listProjections(): Promise<string[]>;
    resetProjection(name: string): Promise<void>;
}

class RecoveryManager {
    constructor(
        private readonly eventStore: MockEventStore,
        private readonly snapshotStore: MockSnapshotStore,
        private readonly projectionStore: MockProjectionStore
    ) {}

    async recoverStorage(): Promise<void> {
        const snapshots = await this.snapshotStore.getAllSnapshots();
        for (const snapshot of snapshots) {
            if (!this.isValidSnapshot(snapshot)) {
                await this.snapshotStore.deleteSnapshot(snapshot.snapshotId);
            }
        }
    }

    async rebuildProjection(streamId: string): Promise<void> {
        const names = await this.projectionStore.listProjections();
        for (const name of names) {
            if (name.includes(streamId)) {
                await this.projectionStore.resetProjection(name);
            }
        }
    }

    async replayEvents(streamId: string, fromVersion: number): Promise<any[]> {
        const events = await this.eventStore.readStream(streamId, fromVersion);
        return events;
    }

    private isValidSnapshot(snapshot: MockSnapshot): boolean {
        return snapshot.snapshotId.length > 0 && snapshot.streamId.length > 0;
    }
}

describe("RecoveryManager", () => {
    let recoveryManager: RecoveryManager;
    let mockEventStore: any;
    let mockSnapshotStore: any;
    let mockProjectionStore: any;

    beforeEach(() => {
        mockEventStore = {
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
        recoveryManager = new RecoveryManager(mockEventStore, mockSnapshotStore, mockProjectionStore);
    });

    describe("recoverStorage", () => {

        it("deletes invalid snapshots", async () => {
            mockSnapshotStore.getAllSnapshots.mockResolvedValue([
                { snapshotId: "", streamId: "stream-1", data: {} },
                { snapshotId: "snap-1", streamId: "stream-1", data: {} }
            ]);
            await recoveryManager.recoverStorage();
            expect(mockSnapshotStore.deleteSnapshot).toHaveBeenCalledWith("");
            expect(mockSnapshotStore.deleteSnapshot).not.toHaveBeenCalledWith("snap-1");
        });

        it("keeps valid snapshots", async () => {
            mockSnapshotStore.getAllSnapshots.mockResolvedValue([
                { snapshotId: "snap-1", streamId: "stream-1", data: {} }
            ]);
            await recoveryManager.recoverStorage();
            expect(mockSnapshotStore.deleteSnapshot).not.toHaveBeenCalled();
        });

        it("handles empty snapshot list", async () => {
            mockSnapshotStore.getAllSnapshots.mockResolvedValue([]);
            await expect(recoveryManager.recoverStorage()).resolves.toBeUndefined();
        });

    });

    describe("rebuildProjection", () => {

        it("resets projections matching the streamId", async () => {
            mockProjectionStore.listProjections.mockResolvedValue([
                "projection-stream-1",
                "projection-stream-2",
                "other-projection"
            ]);
            await recoveryManager.rebuildProjection("stream-1");
            expect(mockProjectionStore.resetProjection).toHaveBeenCalledWith("projection-stream-1");
            expect(mockProjectionStore.resetProjection).not.toHaveBeenCalledWith("projection-stream-2");
            expect(mockProjectionStore.resetProjection).not.toHaveBeenCalledWith("other-projection");
        });

        it("handles no matching projections", async () => {
            mockProjectionStore.listProjections.mockResolvedValue([
                "other-projection",
                "another-projection"
            ]);
            await recoveryManager.rebuildProjection("stream-1");
            expect(mockProjectionStore.resetProjection).not.toHaveBeenCalled();
        });

    });

    describe("replayEvents", () => {

        it("returns events from the event store", async () => {
            const events = [{ id: 1 }, { id: 2 }];
            mockEventStore.readStream.mockResolvedValue(events);
            const result = await recoveryManager.replayEvents("stream-1", 0);
            expect(result).toEqual(events);
            expect(mockEventStore.readStream).toHaveBeenCalledWith("stream-1", 0);
        });

        it("returns empty array when no events exist", async () => {
            mockEventStore.readStream.mockResolvedValue([]);
            const result = await recoveryManager.replayEvents("stream-1", 100);
            expect(result).toEqual([]);
        });

    });

    describe("isValidSnapshot", () => {

        it("returns true for valid snapshots", () => {
            const snapshot = { snapshotId: "snap-1", streamId: "stream-1", data: {} };
            expect((recoveryManager as any).isValidSnapshot(snapshot)).toBe(true);
        });

        it("returns false for empty snapshotId", () => {
            const snapshot = { snapshotId: "", streamId: "stream-1", data: {} };
            expect((recoveryManager as any).isValidSnapshot(snapshot)).toBe(false);
        });

        it("returns false for empty streamId", () => {
            const snapshot = { snapshotId: "snap-1", streamId: "", data: {} };
            expect((recoveryManager as any).isValidSnapshot(snapshot)).toBe(false);
        });

    });

});
