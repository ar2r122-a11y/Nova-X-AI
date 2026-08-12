export class VoiceCacheManager {
    private readonly cache: Map<string, { data: unknown; cachedAt: number; ttlMs?: number }> = new Map();

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (entry.ttlMs && Date.now() - entry.cachedAt > entry.ttlMs) {
            this.cache.delete(key);
            return null;
        }
        return entry.data as T;
    }

    async set(key: string, value: unknown, ttlMs?: number): Promise<void> {
        this.cache.set(key, { data: value, cachedAt: Date.now(), ttlMs });
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}
