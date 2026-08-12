import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceCacheManager } from "../../../src/Infrastructure/Cache/VoiceCacheManager";

describe("VoiceCacheManager", () => {
    let cache: VoiceCacheManager;

    beforeEach(() => {
        cache = new VoiceCacheManager();
    });

    describe("set and get", () => {
        it("stores and retrieves a value", async () => {
            await cache.set("key-1", "value-1");

            const result = await cache.get<string>("key-1");

            expect(result).toBe("value-1");
        });

        it("returns null for missing key", async () => {
            const result = await cache.get<string>("missing");

            expect(result).toBeNull();
        });

        it("stores complex objects", async () => {
            const obj = { id: "voice-1", state: "waiting_for_input" };
            await cache.set("voice-1", obj);

            const result = await cache.get<typeof obj>("voice-1");

            expect(result).toEqual(obj);
        });
    });

    describe("TTL", () => {
        it("returns value before TTL expires", async () => {
            vi.useFakeTimers();
            await cache.set("key-1", "value-1", 1000);

            vi.advanceTimersByTime(500);

            const result = await cache.get<string>("key-1");

            expect(result).toBe("value-1");
            vi.useRealTimers();
        });

        it("returns null after TTL expires", async () => {
            vi.useFakeTimers();
            await cache.set("key-1", "value-1", 1000);

            vi.advanceTimersByTime(1100);

            const result = await cache.get<string>("key-1");

            expect(result).toBeNull();
            vi.useRealTimers();
        });

        it("removes expired entry from cache on access", async () => {
            vi.useFakeTimers();
            await cache.set("key-1", "value-1", 100);

            vi.advanceTimersByTime(200);
            await cache.get<string>("key-1");

            expect(cache.size()).toBe(0);
            vi.useRealTimers();
        });
    });

    describe("delete", () => {
        it("removes a specific key", async () => {
            await cache.set("key-1", "value-1");
            await cache.delete("key-1");

            const result = await cache.get<string>("key-1");

            expect(result).toBeNull();
        });

        it("does not affect other keys", async () => {
            await cache.set("key-1", "value-1");
            await cache.set("key-2", "value-2");
            await cache.delete("key-1");

            expect(await cache.get<string>("key-2")).toBe("value-2");
        });
    });

    describe("clear", () => {
        it("removes all entries", async () => {
            await cache.set("key-1", "value-1");
            await cache.set("key-2", "value-2");
            await cache.clear();

            expect(await cache.get<string>("key-1")).toBeNull();
            expect(await cache.get<string>("key-2")).toBeNull();
            expect(cache.size()).toBe(0);
        });
    });

    describe("size", () => {
        it("returns current entry count", async () => {
            expect(cache.size()).toBe(0);
            await cache.set("key-1", "value-1");
            expect(cache.size()).toBe(1);
            await cache.set("key-2", "value-2");
            expect(cache.size()).toBe(2);
            await cache.delete("key-1");
            expect(cache.size()).toBe(1);
        });
    });
});
