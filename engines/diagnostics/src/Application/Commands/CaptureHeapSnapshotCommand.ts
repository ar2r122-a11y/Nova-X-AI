import { ICommand } from "@nova-x-ai/core";

export interface CaptureHeapSnapshotCommand extends ICommand {
    readonly engine: string;
    readonly correlationId: string;
}
