import { ISnapshotStore, StorageSnapshot } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class SnapshotStore implements ISnapshotStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async saveSnapshot(snapshot: StorageSnapshot): Promise<void> {
        const tx = this.adapter.transaction(["snapshots"], "readwrite");
        const store = tx.objectStore("snapshots");

        await new Promise<void>((resolve, reject) => {
            const request = store.put(snapshot);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSnapshot(streamId: string): Promise<StorageSnapshot | null> {
        const tx = this.adapter.transaction(["snapshots"], "readonly");
        const store = tx.objectStore("snapshots");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const snapshots = request.result as StorageSnapshot[];
                const latest = snapshots
                    .filter(s => s.streamId === streamId)
                    .sort((a, b) => b.version - a.version)[0];
                resolve(latest ?? null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteSnapshot(streamId: string): Promise<void> {
        const tx = this.adapter.transaction(["snapshots"], "readwrite");
        const store = tx.objectStore("snapshots");

        await new Promise<void>((resolve, reject) => {
            const request = store.openCursor();
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    const snapshot = cursor.value as StorageSnapshot;
                    if (snapshot.streamId === streamId) {
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getAllSnapshots(): Promise<StorageSnapshot[]> {
        const tx = this.adapter.transaction(["snapshots"], "readonly");
        const store = tx.objectStore("snapshots");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as StorageSnapshot[]);
            request.onerror = () => reject(request.error);
        });
    }

    async compact(streamId: string, maxAgeMs: number): Promise<number> {
        const snapshots = await this.getAllSnapshots();
        const cutoff = Date.now() - maxAgeMs;
        let removed = 0;

        for (const snapshot of snapshots) {
            if (snapshot.streamId === streamId && snapshot.createdAt < cutoff) {
                await this.deleteSnapshot(snapshot.snapshotId);
                removed++;
            }
        }

        return removed;
    }
}
