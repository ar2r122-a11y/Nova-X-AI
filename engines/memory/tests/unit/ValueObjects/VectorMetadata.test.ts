import { describe, it, expect } from "vitest";
import { VectorMetadata } from "../../../src/Domain/ValueObjects/VectorMetadata";

describe("VectorMetadata", () => {
    it("should create from valid vector", () => {
        const vector = VectorMetadata.create([0.1, 0.2, 0.3]);
        expect(vector.getDimensions()).toBe(3);
        expect(vector.getVector()).toEqual([0.1, 0.2, 0.3]);
    });

    it("should throw for empty vector", () => {
        expect(() => VectorMetadata.create([])).toThrow();
    });

    it("should throw for non-number elements", () => {
        expect(() => VectorMetadata.create([0.1, "bad" as any, 0.3])).toThrow();
    });

    it("should compute cosine similarity correctly", () => {
        const a = VectorMetadata.create([1, 0]);
        const b = VectorMetadata.create([0, 1]);
        expect(a.cosineSimilarity(b)).toBeCloseTo(0, 5);

        const c = VectorMetadata.create([1, 0]);
        const d = VectorMetadata.create([1, 0]);
        expect(c.cosineSimilarity(d)).toBeCloseTo(1, 5);
    });

    it("should return 0 for mismatched dimensions", () => {
        const a = VectorMetadata.create([1, 0]);
        const b = VectorMetadata.create([1, 0, 1]);
        expect(a.cosineSimilarity(b)).toBe(0);
    });
});
