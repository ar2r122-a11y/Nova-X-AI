import { IWorldSnapshotManager } from "../../Domain/Services/IWorldSnapshotManager";
import { SnapshotRepository } from "./SnapshotRepository";

export class SnapshotManager implements IWorldSnapshotManager {
    private readonly snapshotCadence = 50;

    constructor(private readonly snapshotRepository: SnapshotRepository) {}

    async takeSnapshot(worldId: string): Promise<object> {
        const aggregates = ["WorldAggregate", "WorldClockAggregate", "RegionRegistryAggregate"];
        const snapshots: Record<string, unknown> = {};

        for (const aggregateType of aggregates) {
            const snapshot = await this.snapshotRepository.getLatestSnapshot(worldId, aggregateType);
            if (snapshot) {
                snapshots[aggregateType] = snapshot.getData();
            }
        }

        return {
            worldId,
            timestamp: Date.now(),
            aggregates: snapshots
        };
    }

    async restoreFromSnapshot(worldId: string, snapshot: object): Promise<void> {
        const record = snapshot as Record<string, unknown>;
        if (record.worldId !== worldId) {
            throw new Error("Snapshot worldId mismatch.");
        }
    }

    async listSnapshots(worldId: string): Promise<{ timestamp: number; version: number }[]> {
        const result: { timestamp: number; version: number }[] = [];
        const aggregateTypes = ["WorldAggregate", "WorldClockAggregate", "RegionRegistryAggregate"];

        for (const aggregateType of aggregateTypes) {
            const snapshots = await this.snapshotRepository.listSnapshots(worldId, aggregateType);
            for (const snapshot of snapshots) {
                result.push({
                    timestamp: snapshot.getTimestamp(),
                    version: snapshot.getVersion()
                });
            }
        }

        return result.sort((a, b) => a.timestamp - b.timestamp);
    }

    async deleteSnapshot(worldId: string, timestamp: number): Promise<void> {
        const aggregateTypes = ["WorldAggregate", "WorldClockAggregate", "RegionRegistryAggregate"];
        for (const aggregateType of aggregateTypes) {
            await this.snapshotRepository.deleteSnapshot(worldId, aggregateType, timestamp);
        }
    }

    shouldCreateSnapshot(tickCount: number): boolean {
        return tickCount > 0 && tickCount % this.snapshotCadence === 0;
    }
}
