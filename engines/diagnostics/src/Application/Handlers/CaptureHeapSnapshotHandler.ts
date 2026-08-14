import type { ICommandHandler } from "@nova-x-ai/core";
import type { CaptureHeapSnapshotCommand } from "../Commands/CaptureHeapSnapshotCommand";

export class CaptureHeapSnapshotHandler implements ICommandHandler<CaptureHeapSnapshotCommand> {
    constructor(
        private readonly heapSnapshotOrchestrator: {
            capture(engine: string, correlationId: string): Promise<{
                snapshotId: string;
                capturedAt: number;
                durationMs: number;
                totalHeapSizeBytes: number;
                usedHeapSizeBytes: number;
                nodeCount: number;
                edgeCount: number;
            }>;
        }
    ) {}

    public async handle(command: CaptureHeapSnapshotCommand): Promise<void> {
        await this.heapSnapshotOrchestrator.capture(command.engine, command.correlationId);
    }
}
