import { ICommand } from "@nova-x-ai/core";

export interface InterruptDiagnosticsCommand extends ICommand {
    readonly reason: string;
    readonly correlationId: string;
}
