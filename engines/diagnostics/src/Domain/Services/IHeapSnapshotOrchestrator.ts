export interface IHeapSnapshotOrchestrator {
    capture(engine: string, correlationId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    }>;

    getSnapshot(snapshotId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    } | null>;

    listSnapshots(engine?: string): Promise<
        Array<{
            snapshotId: string;
            capturedAt: number;
            engine: string;
            nodeCount: number;
            edgeCount: number;
        }>
    >;

    deleteSnapshot(snapshotId: string): Promise<void>;
}
