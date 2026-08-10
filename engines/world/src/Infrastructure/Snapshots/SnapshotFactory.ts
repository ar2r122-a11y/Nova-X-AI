import { WorldSnapshot } from "./WorldSnapshot";

export class SnapshotFactory {
    static createFromAggregate(worldId: string, aggregateType: string, version: number, data: unknown): WorldSnapshot {
        const checksum = WorldSnapshot.computeChecksum(data);
        return WorldSnapshot.create(worldId, aggregateType, version, data, checksum);
    }

    static verify(snapshot: WorldSnapshot): boolean {
        return WorldSnapshot.verifyChecksum(snapshot);
    }
}
