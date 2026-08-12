import type { IImageCacheProvider } from "../../Contracts/IImageCacheProvider";
import { ImageHotCache } from "./ImageHotCache";

export class ImageCacheProvider implements IImageCacheProvider {
    private readonly hotCache: ImageHotCache;

    constructor(maxSize: number = 100) {
        this.hotCache = new ImageHotCache(maxSize);
    }

    async get(key: string): Promise<Record<string, unknown> | null> {
        return this.hotCache.get(key);
    }

    async set(key: string, value: Record<string, unknown>, ttlSeconds?: number): Promise<void> {
        this.hotCache.set(key, value, ttlSeconds);
    }

    async delete(key: string): Promise<void> {
        this.hotCache.delete(key);
    }

    async clear(): Promise<void> {
        this.hotCache.clear();
    }

    async getKeys(): Promise<string[]> {
        return this.hotCache.getKeys();
    }
}
