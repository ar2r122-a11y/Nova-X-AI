import { describe, it, expect } from "vitest";
import { ContentHash } from "../../../src/Domain/ValueObjects/ContentHash";

describe("ContentHash", () => {
    it("should create from valid SHA-256 hex", () => {
        const hash = ContentHash.create("a".repeat(64));
        expect(hash.getValue()).toBe("a".repeat(64));
    });

    it("should normalize case", () => {
        const hash = ContentHash.create("A".repeat(64));
        expect(hash.getValue()).toBe("a".repeat(64));
    });

    it("should throw for invalid hash", () => {
        expect(() => ContentHash.create("invalid")).toThrow();
        expect(() => ContentHash.create("")).toThrow();
    });

    it("should compute hash deterministically", () => {
        const hash1 = ContentHash.compute("hello world");
        const hash2 = ContentHash.compute("hello world");
        expect(hash1.getValue()).toBe(hash2.getValue());
    });

    it("should produce different hashes for different content", () => {
        const hash1 = ContentHash.compute("hello");
        const hash2 = ContentHash.compute("world");
        expect(hash1.getValue()).not.toBe(hash2.getValue());
    });
});
