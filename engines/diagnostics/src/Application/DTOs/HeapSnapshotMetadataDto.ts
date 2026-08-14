export interface HeapSnapshotMetadataDto {
    readonly snapshotId: string;
    readonly capturedAt: number;
    readonly durationMs: number;
    readonly totalHeapSizeBytes: number;
    readonly usedHeapSizeBytes: number;
    readonly nodeCount: number;
    readonly edgeCount: number;
    readonly engine: string;
    readonly correlationId: string;
}
