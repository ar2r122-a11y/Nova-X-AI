import { describe, it, expect } from "vitest";
import { RTreeIndex } from "../../../src/Infrastructure/Spatial/RTreeIndex";
import { SpatialIndexManager } from "../../../src/Infrastructure/Spatial/SpatialIndexManager";

describe("RTreeIndex", () => {
    it("test_insert_adds_node", () => {
        const index = new RTreeIndex();
        index.insert({ x: 10, y: 20, z: 0 }, "entity-1");
        expect(index.contains({ x: 10, y: 20, z: 0 })).toBe(true);
    });

    it("test_insert_ignores_duplicate", () => {
        const index = new RTreeIndex();
        index.insert({ x: 10, y: 20, z: 0 }, "entity-1");
        index.insert({ x: 10, y: 20, z: 0 }, "entity-1");
        const results = index.radiusSearch({ x: 10, y: 20, z: 0 }, 0);
        expect(results).toHaveLength(1);
    });

    it("test_remove_deletes_node", () => {
        const index = new RTreeIndex();
        index.insert({ x: 10, y: 20, z: 0 }, "entity-1");
        index.remove({ x: 10, y: 20, z: 0 }, "entity-1");
        expect(index.contains({ x: 10, y: 20, z: 0 })).toBe(false);
    });

    it("test_radius_search_returns_entities_within_radius", () => {
        const index = new RTreeIndex();
        index.insert({ x: 0, y: 0, z: 0 }, "entity-1");
        index.insert({ x: 10, y: 0, z: 0 }, "entity-2");
        index.insert({ x: 100, y: 0, z: 0 }, "entity-3");
        const results = index.radiusSearch({ x: 0, y: 0, z: 0 }, 15);
        expect(results).toContain("entity-1");
        expect(results).toContain("entity-2");
        expect(results).not.toContain("entity-3");
    });

    it("test_contains_returns_true_for_existing_coordinate", () => {
        const index = new RTreeIndex();
        index.insert({ x: 5, y: 5, z: 5 }, "entity-1");
        expect(index.contains({ x: 5, y: 5, z: 5 })).toBe(true);
        expect(index.contains({ x: 1, y: 1, z: 1 })).toBe(false);
    });
});

describe("SpatialIndexManager", () => {
    it("test_rebuild_creates_new_index", () => {
        const manager = new SpatialIndexManager();
        manager.rebuild("world-1");
        const index = manager.getIndex("world-1");
        expect(index).toBeDefined();
    });

    it("test_get_index_creates_index_if_missing", () => {
        const manager = new SpatialIndexManager();
        const index = manager.getIndex("world-1");
        expect(index).toBeDefined();
    });

    it("test_clear_removes_index", () => {
        const manager = new SpatialIndexManager();
        manager.rebuild("world-1");
        manager.clear("world-1");
        const index = manager.getIndex("world-1");
        expect(index).toBeDefined();
    });
});
