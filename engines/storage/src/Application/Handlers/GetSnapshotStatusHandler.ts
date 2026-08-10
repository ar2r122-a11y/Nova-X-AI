import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetSnapshotStatusQuery } from "../Queries";

export class GetSnapshotStatusHandler implements IQueryHandler<GetSnapshotStatusQuery, any> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(query: GetSnapshotStatusQuery): Promise<any> {
        const snapshotStore = this.storage.getSnapshotStore();
        const snapshots = await snapshotStore.getAllSnapshots();
        const filtered = query.streamId ? snapshots.filter(s => s.streamId === query.streamId) : snapshots;

        if (filtered.length === 0) {
            return null;
        }

        const latest = filtered.reduce((a, b) => a.version > b.version ? a : b);
        const oldest = filtered.reduce((a, b) => a.createdAt < b.createdAt ? a : b);

        return {
            streamId: query.streamId ?? latest.streamId,
            latestVersion: latest.version,
            snapshotCount: filtered.length,
            oldestSnapshotAgeMs: Date.now() - oldest.createdAt
        };
    }
}
