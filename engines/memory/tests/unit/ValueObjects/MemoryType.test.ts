import { describe, it, expect } from "vitest";
import { MemoryTypeRef, MemoryType } from "../../../src/Domain/ValueObjects/MemoryType";

describe("MemoryTypeRef", () => {
    it("should create from valid string", () => {
        expect(MemoryTypeRef.create("episodic").getValue()).toBe(MemoryType.EPISODIC);
        expect(MemoryTypeRef.create("semantic").getValue()).toBe(MemoryType.SEMANTIC);
        expect(MemoryTypeRef.create("working").getValue()).toBe(MemoryType.WORKING);
    });

    it("should be case-insensitive", () => {
        expect(MemoryTypeRef.create("EPISODIC").getValue()).toBe(MemoryType.EPISODIC);
    });

    it("should throw for invalid type", () => {
        expect(() => MemoryTypeRef.create("invalid")).toThrow();
    });

    it("should have static factories", () => {
        expect(MemoryTypeRef.episodic().getValue()).toBe(MemoryType.EPISODIC);
        expect(MemoryTypeRef.semantic().getValue()).toBe(MemoryType.SEMANTIC);
        expect(MemoryTypeRef.working().getValue()).toBe(MemoryType.WORKING);
    });
});
