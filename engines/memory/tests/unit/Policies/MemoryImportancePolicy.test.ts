import { describe, it, expect } from "vitest";
import { MemoryImportancePolicy } from "../../../src/Domain/Policies/MemoryImportancePolicy";
import { MemoryTypeRef } from "../../../src/Domain/ValueObjects/MemoryType";
import { MemorySalience } from "../../../src/Domain/ValueObjects/MemorySalience";

describe("MemoryImportancePolicy", () => {
    it("should give higher base importance to semantic", () => {
        const semantic = MemoryImportancePolicy.calculateBaseImportance(MemoryTypeRef.semantic(), 0, 0);
        const working = MemoryImportancePolicy.calculateBaseImportance(MemoryTypeRef.working(), 0, 0);
        expect(semantic).toBeGreaterThan(working);
    });

    it("should validate salience range", () => {
        expect(MemoryImportancePolicy.isValidSalience(MemorySalience.create(0.5))).toBe(true);
        expect(MemoryImportancePolicy.isValidSalience(MemorySalience.create(0.0))).toBe(true);
        expect(MemoryImportancePolicy.isValidSalience(MemorySalience.create(1.0))).toBe(true);
    });
});
