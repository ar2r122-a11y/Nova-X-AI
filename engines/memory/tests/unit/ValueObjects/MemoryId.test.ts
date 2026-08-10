import { describe, it, expect } from "vitest";
import { MemoryId } from "../../../src/Domain/ValueObjects/MemoryId";

describe("MemoryId", () => {
    it("should create a MemoryId from a valid string", () => {
        const id = MemoryId.create("mem-123");
        expect(id.getValue()).toBe("mem-123");
    });

    it("should throw for empty MemoryId", () => {
        expect(() => MemoryId.create("")).toThrow("MemoryId cannot be empty.");
        expect(() => MemoryId.create("   ")).toThrow("MemoryId cannot be empty.");
    });

    it("should generate a unique MemoryId", () => {
        const id1 = MemoryId.generate();
        const id2 = MemoryId.generate();
        expect(id1.getValue()).not.toBe(id2.getValue());
        expect(id1.getValue()).toMatch(/^mem-\d+-[a-z0-9]+$/);
    });

    it("should compare equality correctly", () => {
        const id1 = MemoryId.create("mem-123");
        const id2 = MemoryId.create("mem-123");
        const id3 = MemoryId.create("mem-456");
        expect(id1.equals(id2)).toBe(true);
        expect(id1.equals(id3)).toBe(false);
    });

    it("should stringify correctly", () => {
        const id = MemoryId.create("mem-123");
        expect(id.toString()).toBe("mem-123");
    });
});
