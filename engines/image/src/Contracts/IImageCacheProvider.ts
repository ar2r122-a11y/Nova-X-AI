export interface IImageCacheProvider {
    get(key: string): Promise<Record<string, unknown> | null>;
    set(key: string, value: Record<string, unknown>, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    getKeys(): Promise<string[]>;
}
