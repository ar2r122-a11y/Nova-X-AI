import type { IVectorClockStore } from "../../Contracts";
import { VectorClock } from "../../Domain/ValueObjects";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class VectorClockStore implements IVectorClockStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async save(streamId: string, clock: VectorClock): Promise<void> {
        const tx = this.adapter.transaction(["vectorClocks"], "readwrite");
        const store = tx.objectStore("vectorClocks");

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ streamId, entries: clock.toJSON() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async load(streamId: string): Promise<VectorClock | null> {
        const tx = this.adapter.transaction(["vectorClocks"], "readonly");
        const store = tx.objectStore("vectorClocks");

        return new Promise((resolve, reject) => {
            const request = store.get(streamId);
            request.onsuccess = () => {
                const result = request.result as { streamId: string; entries: Record<string, number> } | undefined;
                if (!result) {
                    resolve(null);
                    return;
                }
                resolve(VectorClock.fromMap(new Map(Object.entries(result.entries))));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async delete(streamId: string): Promise<void> {
        const tx = this.adapter.transaction(["vectorClocks"], "readwrite");
        const store = tx.objectStore("vectorClocks");

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(streamId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
