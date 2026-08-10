export interface MemorySnapshotProps {
    memoryEntries: import("./MemoryEntry").MemoryEntryProps[];
    clusters: Array<{
        id: string;
        centroidVector: number[];
        memberMemoryIds: string[];
        memberCount: number;
        createdAt: number;
        updatedAt: number;
    }>;
    createdAt: number;
}

export class MemorySnapshot {
    private readonly props: MemorySnapshotProps;

    private constructor(props: MemorySnapshotProps) {
        this.props = props;
    }

    static create(memoryEntries: import("./MemoryEntry").MemoryEntryProps[]): MemorySnapshot {
        return new MemorySnapshot({
            memoryEntries,
            clusters: [],
            createdAt: Date.now()
        });
    }

    static reconstitute(props: MemorySnapshotProps): MemorySnapshot {
        return new MemorySnapshot(props);
    }

    getMemoryEntries(): import("./MemoryEntry").MemoryEntryProps[] {
        return this.props.memoryEntries;
    }

    getClusters(): Array<{
        id: string;
        centroidVector: number[];
        memberMemoryIds: string[];
        memberCount: number;
        createdAt: number;
        updatedAt: number;
    }> {
        return this.props.clusters;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }
}
