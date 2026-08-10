import { ISnapshotStore, StorageSnapshot } from "@nova-x-ai/storage";
import { SnapshotFactory } from "./SnapshotFactory";
import { WorldSnapshot } from "./WorldSnapshot";

export class SnapshotRepository {
    constructor(private readonly snapshotStore: ISnapshotStore) {}

    async saveSnapshot(worldId: string, aggregateType: string, data: unknown, version: number): Promise<WorldSnapshot> {
        const snapshot = SnapshotFactory.createFromAggregate(worldId, aggregateType, version, data);

        const storageSnapshot: StorageSnapshot = {
            snapshotId: `${worldId}-${aggregateType}-${snapshot.getTimestamp()}`,
            streamId: `${worldId}:${aggregateType}`,
            version,
            data: snapshot.getData(),
            checksum: snapshot.getChecksum(),
            createdAt: snapshot.getTimestamp(),
            compressed: false
        };

        await this.snapshotStore.saveSnapshot(storageSnapshot);
        return snapshot;
    }

    async getLatestSnapshot(worldId: string, aggregateType: string): Promise<WorldSnapshot | null> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${worldId}:${aggregateType}`)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => b.createdAt - a.createdAt);

        if (streamSnapshots.length === 0) {
            return null;
        }

        return this.toWorldSnapshot(streamSnapshots[0]);
    }

    async getSnapshotAtVersion(worldId: string, aggregateType: string, version: number): Promise<WorldSnapshot | null> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${worldId}:${aggregateType}` && s.version <= version)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => b.version - a.version);

        if (streamSnapshots.length === 0) {
            return null;
        }

        return this.toWorldSnapshot(streamSnapshots[0]);
    }

    async deleteSnapshot(worldId: string, aggregateType: string, timestamp: number): Promise<void> {
        const snapshotId = `${worldId}-${aggregateType}-${timestamp}`;
        await this.snapshotStore.deleteSnapshot(snapshotId);
    }

    async listSnapshots(worldId: string, aggregateType: string): Promise<WorldSnapshot[]> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${worldId}:${aggregateType}`)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => a.createdAt - b.createdAt);

        return streamSnapshots.map((s: StorageSnapshot) => this.toWorldSnapshot(s)).filter((s): s is WorldSnapshot => s !== null);
    }

    private toWorldSnapshot(storage: StorageSnapshot): WorldSnapshot | null {
        if (!SnapshotFactory.verify(this.wrap(storage))) {
            return null;
        }
        return WorldSnapshot.create(
            storage.streamId.split(":")[0] ?? "",
            storage.streamId.split(":")[1] ?? "",
            storage.version,
            storage.data,
            storage.checksum
        );
    }

    private wrap(storage: StorageSnapshot): WorldSnapshot {
        return WorldSnapshot.create(
            storage.streamId.split(":")[0] ?? "",
            storage.streamId.split(":")[1] ?? "",
            storage.version,
            storage.data,
            storage.checksum
        );
    }
}
