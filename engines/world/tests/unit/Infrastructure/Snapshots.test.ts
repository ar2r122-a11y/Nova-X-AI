import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldSnapshot } from "../../../src/Infrastructure/Snapshots/WorldSnapshot";
import { SnapshotFactory } from "../../../src/Infrastructure/Snapshots/SnapshotFactory";
import { SnapshotRepository } from "../../../src/Infrastructure/Snapshots/SnapshotRepository";

describe("WorldSnapshot", () => {
    it("test_create_sets_all_properties", () => {
        const snapshot = WorldSnapshot.create("world-1", "WorldAggregate", 5, { state: "active" }, "sha256-abc123");
        expect(snapshot.getWorldId()).toBe("world-1");
        expect(snapshot.getAggregateType()).toBe("WorldAggregate");
        expect(snapshot.getVersion()).toBe(5);
        expect(snapshot.getData()).toEqual({ state: "active" });
        expect(snapshot.getChecksum()).toBe("sha256-abc123");
    });

    it("test_verify_checksum_returns_true_for_valid_snapshot", () => {
        const data = { state: "active" };
        const checksum = WorldSnapshot.computeChecksum(data);
        const snapshot = WorldSnapshot.create("world-1", "WorldAggregate", 5, data, checksum);
        expect(WorldSnapshot.verifyChecksum(snapshot)).toBe(true);
    });

    it("test_verify_checksum_returns_false_for_corrupted_snapshot", () => {
        const snapshot = WorldSnapshot.create("world-1", "WorldAggregate", 5, { state: "active" }, "sha256-invalid");
        expect(WorldSnapshot.verifyChecksum(snapshot)).toBe(false);
    });

    it("test_compute_checksum_returns_consistent_hash", () => {
        const data = { state: "active" };
        const hash1 = WorldSnapshot.computeChecksum(data);
        const hash2 = WorldSnapshot.computeChecksum(data);
        expect(hash1).toBe(hash2);
    });
});

describe("SnapshotFactory", () => {
    it("test_create_from_aggregate_generates_checksum", () => {
        const snapshot = SnapshotFactory.createFromAggregate("world-1", "WorldAggregate", 5, { state: "active" });
        expect(snapshot.getWorldId()).toBe("world-1");
        expect(snapshot.getAggregateType()).toBe("WorldAggregate");
        expect(snapshot.getVersion()).toBe(5);
        expect(snapshot.getChecksum()).toMatch(/^sha256-[a-f0-9]+$/);
    });

    it("test_verify_returns_true_for_valid_snapshot", () => {
        const snapshot = SnapshotFactory.createFromAggregate("world-1", "WorldAggregate", 5, { state: "active" });
        expect(SnapshotFactory.verify(snapshot)).toBe(true);
    });
});

describe("SnapshotRepository", () => {
    let mockSnapshotStore: any;
    let snapshotRepository: SnapshotRepository;

    beforeEach(() => {
        mockSnapshotStore = {
            saveSnapshot: vi.fn(),
            getSnapshot: vi.fn(),
            deleteSnapshot: vi.fn(),
            getAllSnapshots: vi.fn()
        };
        snapshotRepository = new SnapshotRepository(mockSnapshotStore);
    });

    it("test_save_snapshot_persists_with_correct_format", async () => {
        mockSnapshotStore.saveSnapshot.mockResolvedValue(undefined);
        const snapshot = await snapshotRepository.saveSnapshot("world-1", "WorldAggregate", { state: "active" }, 5);
        expect(snapshot.getWorldId()).toBe("world-1");
        expect(snapshot.getAggregateType()).toBe("WorldAggregate");
        expect(mockSnapshotStore.saveSnapshot).toHaveBeenCalledWith(
            expect.objectContaining({
                streamId: "world-1:WorldAggregate",
                version: 5
            })
        );
    });

    it("test_get_latest_snapshot_returns_most_recent", async () => {
        const oldData = { state: "old" };
        const newData = { state: "new" };
        mockSnapshotStore.getAllSnapshots.mockResolvedValue([
            {
                snapshotId: "world-1-WorldAggregate-1000",
                streamId: "world-1:WorldAggregate",
                version: 3,
                data: oldData,
                checksum: WorldSnapshot.computeChecksum(oldData),
                createdAt: 1000,
                compressed: false
            },
            {
                snapshotId: "world-1-WorldAggregate-2000",
                streamId: "world-1:WorldAggregate",
                version: 5,
                data: newData,
                checksum: WorldSnapshot.computeChecksum(newData),
                createdAt: 2000,
                compressed: false
            }
        ]);

        const snapshot = await snapshotRepository.getLatestSnapshot("world-1", "WorldAggregate");
        expect(snapshot?.getVersion()).toBe(5);
        expect(snapshot?.getData()).toEqual({ state: "new" });
    });

    it("test_get_latest_snapshot_returns_null_when_no_snapshots", async () => {
        mockSnapshotStore.getAllSnapshots.mockResolvedValue([]);
        const snapshot = await snapshotRepository.getLatestSnapshot("world-1", "WorldAggregate");
        expect(snapshot).toBeNull();
    });

    it("test_list_snapshots_returns_all_for_world", async () => {
        const data = { state: "active" };
        mockSnapshotStore.getAllSnapshots.mockResolvedValue([
            {
                snapshotId: "world-1-WorldAggregate-1000",
                streamId: "world-1:WorldAggregate",
                version: 3,
                data,
                checksum: WorldSnapshot.computeChecksum(data),
                createdAt: 1000,
                compressed: false
            }
        ]);

        const snapshots = await snapshotRepository.listSnapshots("world-1", "WorldAggregate");
        expect(snapshots).toHaveLength(1);
        expect(snapshots[0].getVersion()).toBe(3);
    });

    it("test_delete_snapshot_removes_by_id", async () => {
        mockSnapshotStore.deleteSnapshot.mockResolvedValue(undefined);
        await snapshotRepository.deleteSnapshot("world-1", "WorldAggregate", 1000);
        expect(mockSnapshotStore.deleteSnapshot).toHaveBeenCalledWith("world-1-WorldAggregate-1000");
    });
});
