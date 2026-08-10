import { describe, it, expect } from "vitest";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";

describe("WorldEventVersion", () => {
    it("test_creation_succeeds_with_non_negative_integer", () => {
        expect(WorldEventVersion.create(0).getValue()).toBe(0);
        expect(WorldEventVersion.create(42).getValue()).toBe(42);
    });

    it("test_creation_throws_with_negative_or_non_integer", () => {
        expect(() => WorldEventVersion.create(-1)).toThrow();
        expect(() => WorldEventVersion.create(1.5)).toThrow();
    });

    it("test_initial_returns_zero", () => {
        expect(WorldEventVersion.initial().getValue()).toBe(0);
    });

    it("test_next_increments_version", () => {
        const v0 = WorldEventVersion.initial();
        const v1 = WorldEventVersion.next(v0);
        const v2 = WorldEventVersion.next(v1);
        expect(v1.getValue()).toBe(1);
        expect(v2.getValue()).toBe(2);
    });

    it("test_comparison_methods_work", () => {
        const v1 = WorldEventVersion.create(1);
        const v2 = WorldEventVersion.create(2);
        expect(v2.isGreaterThan(v1)).toBe(true);
        expect(v1.isLessThan(v2)).toBe(true);
        expect(v1.isLessThanOrEqual(v1)).toBe(true);
        expect(v2.isGreaterThanOrEqual(v2)).toBe(true);
    });
});

