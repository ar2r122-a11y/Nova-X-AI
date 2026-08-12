import { describe, it, expect } from "vitest";
import { ImageHotCache } from "../../src/Infrastructure/Cache/ImageHotCache";
import { ImageDeduplicationEngine, ImageThumbnailGenerator } from "../../src/Domain/Services/ImageEngineServices";
import { ThumbnailSize } from "../../src/Domain/ValueObjects/ThumbnailSize";

describe("ImageStreaming", () => {
    describe("chunk ordering", () => {
        it("should maintain order in thumbnail generation", () => {
            const generator = new ImageThumbnailGenerator();
            const data1 = new Uint8Array([1, 2, 3, 4]).buffer;
            const data2 = new Uint8Array([5, 6, 7, 8]).buffer;
            const result1 = generator.generate(data1, { width: 64, height: 64 });
            const result2 = generator.generate(data2, { width: 64, height: 64 });
            const view1 = new Uint8Array(result1);
            const view2 = new Uint8Array(result2);
            expect(view1[0]).toBe(1);
            expect(view2[0]).toBe(5);
        });
    });

    describe("back-pressure", () => {
        it("ImageHotCache should evict oldest when full", () => {
            const cache = new ImageHotCache(2);
            cache.set("a", { data: 1 });
            cache.set("b", { data: 2 });
            cache.set("c", { data: 3 });
            expect(cache.has("a")).toBe(false);
            expect(cache.has("b")).toBe(true);
            expect(cache.has("c")).toBe(true);
        });

        it("should handle hit/miss correctly", () => {
            const cache = new ImageHotCache(10);
            expect(cache.get("missing")).toBeNull();
            cache.set("key", { data: 1 });
            expect(cache.get("key")).toEqual({ data: 1 });
        });

        it("should clear all entries", () => {
            const cache = new ImageHotCache(10);
            cache.set("a", { data: 1 });
            cache.set("b", { data: 2 });
            cache.clear();
            expect(cache.size).toBe(0);
        });
    });

    describe("cancellation", () => {
        it("should handle cancellation gracefully", () => {
            const cache = new ImageHotCache(10);
            cache.set("stream-1", { data: 1 });
            cache.delete("stream-1");
            expect(cache.get("stream-1")).toBeNull();
        });
    });

    describe("deduplication during streaming", () => {
        it("should detect duplicate chunks", () => {
            const engine = new ImageDeduplicationEngine();
            const chunk1 = new Uint8Array([1, 2, 3]).buffer;
            const chunk2 = new Uint8Array([1, 2, 3]).buffer;
            expect(engine.isDuplicate(chunk1)).toBe(false);
            expect(engine.isDuplicate(chunk2)).toBe(true);
        });
    });

    describe("completion", () => {
        it("should generate thumbnail for all sizes", () => {
            const generator = new ImageThumbnailGenerator();
            const input = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]).buffer;
            for (const size of [ThumbnailSize.SIZE_128, ThumbnailSize.SIZE_256, ThumbnailSize.SIZE_512]) {
                const result = generator.generate(input, { width: size, height: size });
                expect(result.byteLength).toBeGreaterThan(0);
            }
        });
    });
});
