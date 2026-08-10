import { ICacheProvider } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";

export class CacheProvider implements ICacheProvider {
    private readonly adapter: IndexedDBAdapter;
    private readonly memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
        this.startEvictionWorker();
    }

    async get<T>(key: string): Promise<T | null> {
        const memory = this.memoryCache.get(key);
        if (memory && memory.expiresAt > Date.now()) {
            return memory.value as T;
        }
        if (memory) {
            this.memoryCache.delete(key);
        }

        const tx = this.adapter.transaction(["cache"], "readonly");
        const store = tx.objectStore("cache");

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => {
                const result = request.result as { key: string; value: unknown; expiresAt: number } | undefined;
                if (result && result.expiresAt > Date.now()) {
                    this.memoryCache.set(key, { value: result.value, expiresAt: result.expiresAt });
                    resolve(result.value as T);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async set(key: string, value: unknown, ttlMs: number = 60000): Promise<void> {
        const expiresAt = Date.now() + ttlMs;
        this.memoryCache.set(key, { value, expiresAt });

        const tx = this.adapter.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ key, value, expiresAt });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key: string): Promise<void> {
        this.memoryCache.delete(key);

        const tx = this.adapter.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");

        await new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear(): Promise<void> {
        this.memoryCache.clear();

        const tx = this.adapter.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");

        await new Promise<void>((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getKeys(pattern?: string): Promise<string[]> {
        const keys = Array.from(this.memoryCache.keys());
        if (!pattern) return keys;
        return keys.filter(k => k.includes(pattern));
    }

    private startEvictionWorker(): void {
        setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.memoryCache) {
                if (entry.expiresAt <= now) {
                    this.memoryCache.delete(key);
                }
            }
        }, 30000);
    }
}
