import type { ICommandHandler } from "@nova-x-ai/core";
import type { InterruptDiagnosticsCommand } from "../Commands/InterruptDiagnosticsCommand";

export class InterruptDiagnosticsHandler implements ICommandHandler<InterruptDiagnosticsCommand> {
    constructor(
        private readonly streamingWorker: {
            interrupt(): Promise<void>;
        }
    ) {}

    public async handle(_command: InterruptDiagnosticsCommand): Promise<void> {
        await this.streamingWorker.interrupt();
    }
}
