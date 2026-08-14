export class HeapSnapshotMetadata {
    private readonly snapshotId: string;
    private readonly capturedAt: number;
    private readonly durationMs: number;
    private readonly totalHeapSizeBytes: number;
    private readonly usedHeapSizeBytes: number;
    private readonly nodeCount: number;
    private readonly edgeCount: number;
    private readonly engine: string;
    private readonly correlationId: string;

    constructor(opts: {
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
        engine: string;
        correlationId: string;
    }) {
        this.snapshotId = opts.snapshotId;
        this.capturedAt = opts.capturedAt;
        this.durationMs = opts.durationMs;
        this.totalHeapSizeBytes = opts.totalHeapSizeBytes;
        this.usedHeapSizeBytes = opts.usedHeapSizeBytes;
        this.nodeCount = opts.nodeCount;
        this.edgeCount = opts.edgeCount;
        this.engine = opts.engine;
        this.correlationId = opts.correlationId;
    }

    public getSnapshotId(): string {
        return this.snapshotId;
    }

    public getCapturedAt(): number {
        return this.capturedAt;
    }

    public getDurationMs(): number {
        return this.durationMs;
    }

    public getTotalHeapSizeBytes(): number {
        return this.totalHeapSizeBytes;
    }

    public getUsedHeapSizeBytes(): number {
        return this.usedHeapSizeBytes;
    }

    public getNodeCount(): number {
        return this.nodeCount;
    }

    public getEdgeCount(): number {
        return this.edgeCount;
    }

    public getEngine(): string {
        return this.engine;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }
}
