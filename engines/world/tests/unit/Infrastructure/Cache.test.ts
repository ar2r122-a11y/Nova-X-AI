import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldCacheManager } from "../../../src/Infrastructure/Cache/WorldCacheManager";

describe("WorldCacheManager", () => {
    let mockCacheProvider: any;
    let cacheManager: WorldCacheManager;

    beforeEach(() => {
        mockCacheProvider = {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
            getKeys: vi.fn()
        };
        cacheManager = new WorldCacheManager(mockCacheProvider);
    });

    it("test_get_returns_cached_value", async () => {
        mockCacheProvider.get.mockResolvedValue({ data: "cached" });
        const result = await cacheManager.get<{ data: string }>("test-key");
        expect(result).toEqual({ data: "cached" });
        expect(mockCacheProvider.get).toHaveBeenCalledWith("world:test-key");
    });

    it("test_get_returns_null_on_miss", async () => {
        mockCacheProvider.get.mockResolvedValue(null);
        const result = await cacheManager.get("test-key");
        expect(result).toBeNull();
    });

    it("test_set_stores_value_with_prefix", async () => {
        await cacheManager.set("test-key", { data: "value" }, 60000);
        expect(mockCacheProvider.set).toHaveBeenCalledWith("world:test-key", { data: "value" }, 60000);
    });

    it("test_invalidate_deletes_matching_keys", async () => {
        mockCacheProvider.getKeys.mockResolvedValue(["world:test-1", "world:test-2"]);
        await cacheManager.invalidate("test-*");
        expect(mockCacheProvider.getKeys).toHaveBeenCalledWith("world:test-*");
        expect(mockCacheProvider.delete).toHaveBeenCalledTimes(2);
    });

    it("test_clear_removes_all_world_keys", async () => {
        mockCacheProvider.getKeys.mockResolvedValue(["world:key-1", "world:key-2"]);
        await cacheManager.clear();
        expect(mockCacheProvider.getKeys).toHaveBeenCalledWith("world:*");
        expect(mockCacheProvider.delete).toHaveBeenCalledTimes(2);
    });
});
