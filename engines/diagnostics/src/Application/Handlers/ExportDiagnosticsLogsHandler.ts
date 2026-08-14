import type { ICommandHandler } from "@nova-x-ai/core";
import type { ExportDiagnosticsLogsCommand } from "../Commands/ExportDiagnosticsLogsCommand";

export class ExportDiagnosticsLogsHandler implements ICommandHandler<ExportDiagnosticsLogsCommand> {
    constructor(
        private readonly logVault: {
            query(filters: {
                engine?: string;
                level?: string;
                fromTimestamp?: number;
                toTimestamp?: number;
                limit?: number;
            }): Promise<Array<{
                id: string;
                level: string;
                message: string;
                engine: string;
                correlationId: string | null;
                metadata: Record<string, unknown>;
                timestamp: number;
            }>>;
        }
    ) {}

    public async handle(command: ExportDiagnosticsLogsCommand): Promise<void> {
        await this.logVault.query({
            engine: command.engine,
            fromTimestamp: command.fromTimestamp,
            toTimestamp: command.toTimestamp,
            limit: 1000
        });
    }
}
