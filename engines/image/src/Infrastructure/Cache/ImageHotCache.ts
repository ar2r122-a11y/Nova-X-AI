export class ImageHotCache {
    private readonly cache: Map<string, { value: Record<string, unknown>; expiresAt: number }> = new Map();
    private readonly maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: string): Record<string, unknown> | null {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.value;
    }

    set(key: string, value: Record<string, unknown>, ttlSeconds: number = 300): void {
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            const oldestKey = this.cache.keys().next().value!;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000
        });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    clear(): void {
        this.cache.clear();
    }

    getKeys(): string[] {
        return Array.from(this.cache.keys());
    }

    get size(): number {
        return this.cache.size;
    }
}
