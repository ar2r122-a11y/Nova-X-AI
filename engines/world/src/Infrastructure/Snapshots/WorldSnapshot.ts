export interface WorldSnapshotData {
    readonly worldId: string;
    readonly aggregateType: string;
    readonly version: number;
    readonly timestamp: number;
    readonly data: unknown;
    readonly checksum: string;
}

export class WorldSnapshot {
    private readonly worldId: string;
    private readonly aggregateType: string;
    private readonly version: number;
    private readonly timestamp: number;
    private readonly data: unknown;
    private readonly checksum: string;

    private constructor(data: WorldSnapshotData) {
        this.worldId = data.worldId;
        this.aggregateType = data.aggregateType;
        this.version = data.version;
        this.timestamp = data.timestamp;
        this.data = data.data;
        this.checksum = data.checksum;
    }

    static create(worldId: string, aggregateType: string, version: number, data: unknown, checksum: string): WorldSnapshot {
        return new WorldSnapshot({
            worldId,
            aggregateType,
            version,
            timestamp: Date.now(),
            data,
            checksum
        });
    }

    static verifyChecksum(snapshot: WorldSnapshot): boolean {
        const computed = WorldSnapshot.computeChecksum(snapshot.data);
        return computed === snapshot.checksum;
    }

    static computeChecksum(data: unknown): string {
        const json = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < json.length; i++) {
            const char = json.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `sha256-${Math.abs(hash).toString(16).padStart(8, "0")}`;
    }

    getWorldId(): string {
        return this.worldId;
    }

    getAggregateType(): string {
        return this.aggregateType;
    }

    getVersion(): number {
        return this.version;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getData(): unknown {
        return this.data;
    }

    getChecksum(): string {
        return this.checksum;
    }
}
