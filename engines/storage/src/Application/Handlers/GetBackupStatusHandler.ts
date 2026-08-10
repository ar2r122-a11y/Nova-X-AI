import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetBackupStatusQuery } from "../Queries";

export class GetBackupStatusHandler implements IQueryHandler<GetBackupStatusQuery, any[]> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(_query: GetBackupStatusQuery): Promise<any[]> {
        const backups = await this.storage.getBackupStore().listBackups();
        return backups.map(b => ({
            backupId: b.backupId,
            createdAt: b.createdAt,
            sizeBytes: b.sizeBytes,
            compressed: b.compressed,
            checksum: b.checksum
        }));
    }
}
