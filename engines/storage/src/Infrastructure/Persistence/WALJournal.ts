import type { IWAL } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class WALJournal implements IWAL {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async append(entry: { operation: string; data: unknown; timestamp: number }): Promise<void> {
        const tx = this.adapter.transaction(["wal"], "readwrite");
        const store = tx.objectStore("wal");

        await new Promise<void>((resolve, reject) => {
            const request = store.add(entry);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async readEntries(fromIndex: number): Promise<{ operation: string; data: unknown; timestamp: number }[]> {
        const tx = this.adapter.transaction(["wal"], "readonly");
        const store = tx.objectStore("wal");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const all = request.result as { index?: number; operation: string; data: unknown; timestamp: number }[];
                resolve(all.filter(e => (e.index ?? 0) >= fromIndex));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async truncate(upToIndex: number): Promise<void> {
        const tx = this.adapter.transaction(["wal"], "readwrite");
        const store = tx.objectStore("wal");

        await new Promise<void>((resolve, reject) => {
            const request = store.openCursor();
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    if ((cursor.value as any).index <= upToIndex) {
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

    async clear(): Promise<void> {
        const tx = this.adapter.transaction(["wal"], "readwrite");
        const store = tx.objectStore("wal");
        await new Promise<void>((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getCount(): Promise<number> {
        const tx = this.adapter.transaction(["wal"], "readonly");
        const store = tx.objectStore("wal");

        return new Promise((resolve, reject) => {
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
