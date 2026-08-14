import { ICommand } from "@nova-x-ai/core";

export interface ExportDiagnosticsLogsCommand extends ICommand {
    readonly engine?: string;
    readonly fromTimestamp?: number;
    readonly toTimestamp?: number;
    readonly correlationId: string;
}
