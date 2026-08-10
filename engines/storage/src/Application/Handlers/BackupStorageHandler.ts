import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { BackupStorageCommand } from "../Commands";

export class BackupStorageHandler implements ICommandHandler<BackupStorageCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: BackupStorageCommand): Promise<void> {
        const backupStore = this.storage.getBackupStore();
        const quota = await this.storage.getQuotaUsage();

        const backupId = `backup-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const manifest = {
            backupId,
            createdAt: Date.now(),
            sizeBytes: quota.totalBytes,
            checksum: `sha256-${Math.random().toString(36).slice(2, 9)}`,
            encryptionKeyId: "default",
            compressed: command.compressionEnabled,
            engineVersions: { storage: "0.1.0" }
        } as any;

        await backupStore.createBackup(manifest);

        const { StorageBackupCompletedEvent } = await import("../../Domain/Events");
        await this.storage.eventBus.publish(
            new StorageBackupCompletedEvent(
                backupId,
                manifest.sizeBytes,
                `storage-${Date.now()}`
            )
        );
    }
}
