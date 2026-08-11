import { IStorySnapshotManager } from "../../Domain/Services/IStorySnapshotManager";
import { SnapshotRepository } from "./SnapshotRepository";

export class SnapshotManager implements IStorySnapshotManager {
    private readonly snapshotCadence = 50;

    constructor(private readonly snapshotRepository: SnapshotRepository) {}

    async takeSnapshot(storyId: string): Promise<object> {
        const aggregates = ["StoryAggregate"];
        const snapshots: Record<string, unknown> = {};

        for (const aggregateType of aggregates) {
            const snapshot = await this.snapshotRepository.getLatestSnapshot(storyId, aggregateType);
            if (snapshot) {
                snapshots[aggregateType] = snapshot.getData();
            }
        }

        return {
            storyId,
            timestamp: Date.now(),
            aggregates: snapshots,
        };
    }

    async restoreFromSnapshot(storyId: string, snapshot: object): Promise<void> {
        const record = snapshot as Record<string, unknown>;
        if (record.storyId !== storyId) {
            throw new Error("Snapshot storyId mismatch.");
        }
    }

    async listSnapshots(storyId: string): Promise<{ timestamp: number; version: number }[]> {
        const result: { timestamp: number; version: number }[] = [];
        const aggregateTypes = ["StoryAggregate"];

        for (const aggregateType of aggregateTypes) {
            const snapshots = await this.snapshotRepository.listSnapshots(storyId, aggregateType);
            for (const snapshot of snapshots) {
                result.push({
                    timestamp: snapshot.getTimestamp(),
                    version: snapshot.getVersion(),
                });
            }
        }

        return result.sort((a, b) => a.timestamp - b.timestamp);
    }

    async deleteSnapshot(storyId: string, timestamp: number): Promise<void> {
        const aggregateTypes = ["StoryAggregate"];
        for (const aggregateType of aggregateTypes) {
            await this.snapshotRepository.deleteSnapshot(storyId, aggregateType, timestamp);
        }
    }

    shouldCreateSnapshot(version: number): boolean {
        return version > 0 && version % this.snapshotCadence === 0;
    }
}
