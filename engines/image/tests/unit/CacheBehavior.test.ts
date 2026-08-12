import { describe, it, expect } from "vitest";
import { ImageHotCache } from "../../src/Infrastructure/Cache/ImageHotCache";

describe("CacheBehavior", () => {
    describe("ImageHotCache", () => {
        it("should evict oldest when full", () => {
            const cache = new ImageHotCache(2);
            cache.set("a", { value: 1 });
            cache.set("b", { value: 2 });
            cache.set("c", { value: 3 });
            expect(cache.has("a")).toBe(false);
            expect(cache.has("b")).toBe(true);
            expect(cache.has("c")).toBe(true);
        });

        it("should handle get miss", () => {
            const cache = new ImageHotCache(5);
            expect(cache.get("missing")).toBeNull();
        });

        it("should clear all entries", () => {
            const cache = new ImageHotCache(5);
            cache.set("a", { value: 1 });
            cache.set("b", { value: 2 });
            cache.clear();
            expect(cache.size).toBe(0);
        });

        it("should track size correctly", () => {
            const cache = new ImageHotCache(10);
            expect(cache.size).toBe(0);
            cache.set("a", { value: 1 });
            expect(cache.size).toBe(1);
            cache.set("b", { value: 2 });
            expect(cache.size).toBe(2);
        });

        it("should overwrite existing key without eviction", () => {
            const cache = new ImageHotCache(2);
            cache.set("a", { value: 1 });
            cache.set("b", { value: 2 });
            cache.set("a", { value: 10 });
            expect(cache.size).toBe(2);
            expect(cache.get("a")).toEqual({ value: 10 });
        });

        it("should delete entries", () => {
            const cache = new ImageHotCache(10);
            cache.set("a", { value: 1 });
            cache.delete("a");
            expect(cache.get("a")).toBeNull();
            expect(cache.size).toBe(0);
        });
    });
});
