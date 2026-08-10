import { describe, it, expect } from "vitest";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("WorldId", () => {
    it("test_world_id_creation_succeeds_with_valid_id", () => {
        const id = WorldId.create("world-123");
        expect(id.getValue()).toBe("world-123");
    });

    it("test_world_id_creation_throws_with_empty_id", () => {
        expect(() => WorldId.create("")).toThrow("WorldId cannot be empty.");
        expect(() => WorldId.create("   ")).toThrow("WorldId cannot be empty.");
    });

    it("test_world_id_equality_works_correctly", () => {
        const a = WorldId.create("world-1");
        const b = WorldId.create("world-1");
        const c = WorldId.create("world-2");
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
    });
});

