import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetStorageStatsQuery } from "../Queries";

export class GetStorageStatsHandler implements IQueryHandler<GetStorageStatsQuery, any> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(_query: GetStorageStatsQuery): Promise<any> {
        const eventStore = this.storage.getEventStore();
        const snapshotStore = this.storage.getSnapshotStore();
        const backupStore = this.storage.getBackupStore();

        const allEvents = await eventStore.readAllStreams(0, Number.MAX_SAFE_INTEGER);
        const snapshots = await snapshotStore.getAllSnapshots();
        const backups = await backupStore.listBackups();

        return {
            totalTransactions: new Set(allEvents.map(e => (e as any).streamId)).size,
            totalEvents: allEvents.length,
            totalSnapshots: snapshots.length,
            totalBackups: backups.length,
            activeStreams: new Set(allEvents.map(e => (e as any).streamId)).size
        };
    }
}
