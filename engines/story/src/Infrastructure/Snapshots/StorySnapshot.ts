export interface StorySnapshotData {
    readonly storyId: string;
    readonly aggregateType: string;
    readonly version: number;
    readonly timestamp: number;
    readonly data: unknown;
    readonly checksum: string;
}

export class StorySnapshot {
    private readonly storyId: string;
    private readonly aggregateType: string;
    private readonly version: number;
    private readonly timestamp: number;
    private readonly data: unknown;
    private readonly checksum: string;

    private constructor(data: StorySnapshotData) {
        this.storyId = data.storyId;
        this.aggregateType = data.aggregateType;
        this.version = data.version;
        this.timestamp = data.timestamp;
        this.data = data.data;
        this.checksum = data.checksum;
    }

    static create(storyId: string, aggregateType: string, version: number, data: unknown, checksum: string): StorySnapshot {
        return new StorySnapshot({
            storyId,
            aggregateType,
            version,
            timestamp: Date.now(),
            data,
            checksum,
        });
    }

    static verifyChecksum(snapshot: StorySnapshot): boolean {
        const computed = StorySnapshot.computeChecksum(snapshot.data);
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

    getStoryId(): string {
        return this.storyId;
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
