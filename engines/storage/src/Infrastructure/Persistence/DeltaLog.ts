import type { IDeltaLog } from "../../Contracts";
import { VectorClock } from "../../Domain/ValueObjects";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class DeltaLog implements IDeltaLog {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async recordDelta(streamId: string, delta: unknown, clock: VectorClock): Promise<void> {
        const tx = this.adapter.transaction(["deltaLog"], "readwrite");
        const store = tx.objectStore("deltaLog");

        await new Promise<void>((resolve, reject) => {
            const request = store.add({
                streamId,
                delta,
                clock: clock.toJSON(),
                timestamp: Date.now()
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getDeltas(streamId: string): Promise<{ delta: unknown; clock: VectorClock; timestamp: number }[]> {
        const tx = this.adapter.transaction(["deltaLog"], "readonly");
        const store = tx.objectStore("deltaLog");
        const index = store.index("streamId");

        return new Promise((resolve, reject) => {
            const request = index.getAll(streamId);
            request.onsuccess = () => {
                const results = request.result as { streamId: string; delta: unknown; clock: Record<string, number>; timestamp: number }[];
                resolve(results.map(r => ({
                    delta: r.delta,
                    clock: VectorClock.fromMap(new Map(Object.entries(r.clock))),
                    timestamp: r.timestamp
                })));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async resolveConflicts(streamId: string, localClock: VectorClock, remoteClock: VectorClock): Promise<unknown> {
        const comparison = localClock.compare(remoteClock);
        const deltas = await this.getDeltas(streamId);

        if (comparison === "equal" || comparison === "after") {
            return deltas;
        }

        if (comparison === "concurrent") {
            const merged = localClock.merge(remoteClock);
            return { deltas, mergedClock: merged };
        }

        return deltas;
    }

    async clear(streamId: string): Promise<void> {
        const tx = this.adapter.transaction(["deltaLog"], "readwrite");
        const store = tx.objectStore("deltaLog");
        const index = store.index("streamId");

        await new Promise<void>((resolve, reject) => {
            const request = index.openCursor(streamId);
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
