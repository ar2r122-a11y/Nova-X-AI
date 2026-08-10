import { ICacheProvider } from "@nova-x-ai/storage";

export class WorldCacheManager {
    private readonly regionPrefix = "world:";

    constructor(private readonly cacheProvider: ICacheProvider) {}

    async get<T>(key: string): Promise<T | null> {
        const fullKey = this.buildKey(key);
        return this.cacheProvider.get<T>(fullKey);
    }

    async set(key: string, value: unknown, ttlMs?: number): Promise<void> {
        const fullKey = this.buildKey(key);
        await this.cacheProvider.set(fullKey, value, ttlMs);
    }

    async invalidate(pattern: string): Promise<void> {
        const fullPattern = this.buildKey(pattern);
        const keys = await this.cacheProvider.getKeys(fullPattern);
        for (const key of keys) {
            await this.cacheProvider.delete(key);
        }
    }

    async clear(): Promise<void> {
        const keys = await this.cacheProvider.getKeys(`${this.regionPrefix}*`);
        for (const key of keys) {
            await this.cacheProvider.delete(key);
        }
    }

    private buildKey(key: string): string {
        return `${this.regionPrefix}${key}`;
    }
}
