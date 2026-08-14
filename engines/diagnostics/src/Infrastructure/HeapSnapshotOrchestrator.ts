import type { IHeapSnapshotOrchestrator } from "../Domain/Services/IHeapSnapshotOrchestrator";
import { HeapSnapshotMetadata } from "../Domain/Entities/HeapSnapshotMetadata";

export class HeapSnapshotOrchestrator implements IHeapSnapshotOrchestrator {
    private readonly snapshots = new Map<string, HeapSnapshotMetadata>();
    private readonly timeoutMs = 30000;

    public async capture(engine: string, correlationId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    }> {
        const startTime = Date.now();
        const snapshotId = `heap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        await this.simulateCapture();

        const durationMs = Date.now() - startTime;
        const totalHeapSizeBytes = this.estimateHeapSize();
        const usedHeapSizeBytes = Math.floor(totalHeapSizeBytes * (0.4 + Math.random() * 0.4));
        const nodeCount = Math.floor(1000 + Math.random() * 9000);
        const edgeCount = Math.floor(nodeCount * 1.5);

        const metadata = new HeapSnapshotMetadata({
            snapshotId,
            capturedAt: startTime,
            durationMs,
            totalHeapSizeBytes,
            usedHeapSizeBytes,
            nodeCount,
            edgeCount,
            engine,
            correlationId
        });

        this.snapshots.set(snapshotId, metadata);

        return {
            snapshotId,
            capturedAt: startTime,
            durationMs,
            totalHeapSizeBytes,
            usedHeapSizeBytes,
            nodeCount,
            edgeCount
        };
    }

    public async getSnapshot(snapshotId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    } | null> {
        const snapshot = this.snapshots.get(snapshotId);
        if (!snapshot) {
            return null;
        }
        return {
            snapshotId: snapshot.getSnapshotId(),
            capturedAt: snapshot.getCapturedAt(),
            durationMs: snapshot.getDurationMs(),
            totalHeapSizeBytes: snapshot.getTotalHeapSizeBytes(),
            usedHeapSizeBytes: snapshot.getUsedHeapSizeBytes(),
            nodeCount: snapshot.getNodeCount(),
            edgeCount: snapshot.getEdgeCount()
        };
    }

    public async listSnapshots(engine?: string): Promise<
        Array<{
            snapshotId: string;
            capturedAt: number;
            engine: string;
            nodeCount: number;
            edgeCount: number;
        }>
    > {
        const results: Array<{
            snapshotId: string;
            capturedAt: number;
            engine: string;
            nodeCount: number;
            edgeCount: number;
        }> = [];

        for (const snapshot of this.snapshots.values()) {
            if (!engine || snapshot.getEngine() === engine) {
                results.push({
                    snapshotId: snapshot.getSnapshotId(),
                    capturedAt: snapshot.getCapturedAt(),
                    engine: snapshot.getEngine(),
                    nodeCount: snapshot.getNodeCount(),
                    edgeCount: snapshot.getEdgeCount()
                });
            }
        }

        return results;
    }

    public async deleteSnapshot(snapshotId: string): Promise<void> {
        this.snapshots.delete(snapshotId);
    }

    private async simulateCapture(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    private estimateHeapSize(): number {
        if (typeof performance !== "undefined" && (performance as any).memory?.jsHeapSizeLimit) {
            return (performance as any).memory.jsHeapSizeLimit;
        }
        return 100 * 1024 * 1024;
    }
}
