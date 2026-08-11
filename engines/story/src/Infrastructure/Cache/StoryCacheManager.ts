import { ICacheProvider } from "@nova-x-ai/storage";

export class StoryCacheManager {
    private readonly defaultTtl = 300000;
    private readonly prefix = "story:cache:";

    constructor(private readonly cacheProvider: ICacheProvider) {}

    async get<T>(key: string): Promise<T | null> {
        const fullKey = `${this.prefix}${key}`;
        return this.cacheProvider.get<T>(fullKey);
    }

    async set(key: string, value: unknown, ttlMs?: number): Promise<void> {
        const fullKey = `${this.prefix}${key}`;
        await this.cacheProvider.set(fullKey, value, ttlMs ?? this.defaultTtl);
    }

    async delete(key: string): Promise<void> {
        const fullKey = `${this.prefix}${key}`;
        await this.cacheProvider.delete(fullKey);
    }

    async clear(): Promise<void> {
        const keys = await this.cacheProvider.getKeys(`${this.prefix}*`);
        for (const key of keys) {
            await this.cacheProvider.delete(key);
        }
    }

    getCacheKey(type: string, id: string): string {
        return `${type}:${id}`;
    }
}
