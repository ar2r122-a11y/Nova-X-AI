import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { ResetDeltaLogCommand } from "../Commands";

export class ResetDeltaLogHandler implements ICommandHandler<ResetDeltaLogCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: ResetDeltaLogCommand): Promise<void> {
        await this.storage.getDeltaLog().clear(command.streamId);
    }
}
