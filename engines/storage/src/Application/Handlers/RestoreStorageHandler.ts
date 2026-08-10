import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { RestoreStorageCommand } from "../Commands";

export class RestoreStorageHandler implements ICommandHandler<RestoreStorageCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: RestoreStorageCommand): Promise<void> {
        await this.storage.getBackupStore().restoreBackup(command.backupId);
        await this.storage.recover();
    }
}
