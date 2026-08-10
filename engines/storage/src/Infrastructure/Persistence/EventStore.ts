import { IEventStore, StorageEvent } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class EventStore implements IEventStore {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async appendToStream(streamId: string, events: StorageEvent[], expectedVersion: number): Promise<void> {
        const tx = this.adapter.transaction(["events"], "readwrite");
        const store = tx.objectStore("events");

        const existing = await this.readStream(streamId, 0);
        const currentVersion = existing.length;

        if (currentVersion !== expectedVersion) {
            throw new Error(`Concurrency conflict: expected version ${expectedVersion}, actual ${currentVersion}`);
        }

        for (const event of events) {
            await new Promise<void>((resolve, reject) => {
                const request = store.put(event);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }

    async readStream(streamId: string, fromVersion: number): Promise<StorageEvent[]> {
        const tx = this.adapter.transaction(["events"], "readonly");
        const store = tx.objectStore("events");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const all = request.result as StorageEvent[];
                const filtered = all
                    .filter(e => e.streamId === streamId && e.version > fromVersion)
                    .sort((a, b) => a.version - b.version);
                resolve(filtered);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async readAllStreams(fromPosition: number, limit: number): Promise<StorageEvent[]> {
        const tx = this.adapter.transaction(["events"], "readonly");
        const store = tx.objectStore("events");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const all = request.result as StorageEvent[];
                resolve(all.slice(fromPosition, fromPosition + limit));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getStreamVersion(streamId: string): Promise<number> {
        const events = await this.readStream(streamId, 0);
        return events.length > 0 ? events[events.length - 1].version : 0;
    }

    subscribeToStream(streamId: string, handler: (event: StorageEvent) => Promise<void>): () => void {
        const interval = setInterval(async () => {
            const events = await this.readStream(streamId, 0);
            for (const event of events) {
                await handler(event);
            }
        }, 1000);

        return () => clearInterval(interval);
    }
}
