import { ISnapshotStore, StorageSnapshot } from "@nova-x-ai/storage";
import { SnapshotFactory } from "./SnapshotFactory";
import { StorySnapshot } from "./StorySnapshot";

export class SnapshotRepository {
    constructor(private readonly snapshotStore: ISnapshotStore) {}

    async saveSnapshot(storyId: string, aggregateType: string, data: unknown, version: number): Promise<StorySnapshot> {
        const snapshot = SnapshotFactory.createFromAggregate(storyId, aggregateType, version, data);

        const storageSnapshot: StorageSnapshot = {
            snapshotId: `${storyId}-${aggregateType}-${snapshot.getTimestamp()}`,
            streamId: `${storyId}:${aggregateType}`,
            version,
            data: snapshot.getData(),
            checksum: snapshot.getChecksum(),
            createdAt: snapshot.getTimestamp(),
            compressed: false,
        };

        await this.snapshotStore.saveSnapshot(storageSnapshot);
        return snapshot;
    }

    async getLatestSnapshot(storyId: string, aggregateType: string): Promise<StorySnapshot | null> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${storyId}:${aggregateType}`)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => b.createdAt - a.createdAt);

        if (streamSnapshots.length === 0) {
            return null;
        }

        return this.toStorySnapshot(streamSnapshots[0]);
    }

    async getSnapshotAtVersion(storyId: string, aggregateType: string, version: number): Promise<StorySnapshot | null> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${storyId}:${aggregateType}` && s.version <= version)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => b.version - a.version);

        if (streamSnapshots.length === 0) {
            return null;
        }

        return this.toStorySnapshot(streamSnapshots[0]);
    }

    async deleteSnapshot(storyId: string, aggregateType: string, timestamp: number): Promise<void> {
        const snapshotId = `${storyId}-${aggregateType}-${timestamp}`;
        await this.snapshotStore.deleteSnapshot(snapshotId);
    }

    async listSnapshots(storyId: string, aggregateType: string): Promise<StorySnapshot[]> {
        const snapshots: StorageSnapshot[] = await this.snapshotStore.getAllSnapshots();
        const streamSnapshots = snapshots
            .filter((s: StorageSnapshot) => s.streamId === `${storyId}:${aggregateType}`)
            .sort((a: StorageSnapshot, b: StorageSnapshot) => a.createdAt - b.createdAt);

        return streamSnapshots.map((s: StorageSnapshot) => this.toStorySnapshot(s)).filter((s): s is StorySnapshot => s !== null);
    }

    private toStorySnapshot(storage: StorageSnapshot): StorySnapshot | null {
        if (!SnapshotFactory.verify(this.wrap(storage))) {
            return null;
        }
        return StorySnapshot.create(
            storage.streamId.split(":")[0] ?? "",
            storage.streamId.split(":")[1] ?? "",
            storage.version,
            storage.data,
            storage.checksum
        );
    }

    private wrap(storage: StorageSnapshot): StorySnapshot {
        return StorySnapshot.create(
            storage.streamId.split(":")[0] ?? "",
            storage.streamId.split(":")[1] ?? "",
            storage.version,
            storage.data,
            storage.checksum
        );
    }
}
