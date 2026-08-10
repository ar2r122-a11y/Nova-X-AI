import { describe, it, expect } from "vitest";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";

describe("RegionId", () => {
    it("test_creation_succeeds_with_valid_id", () => {
        expect(RegionId.create("region-1").getValue()).toBe("region-1");
    });

    it("test_creation_throws_with_empty_id", () => {
        expect(() => RegionId.create("")).toThrow();
        expect(() => RegionId.create("   ")).toThrow();
    });

    it("test_equality_works_correctly", () => {
        const a = RegionId.create("r1");
        const b = RegionId.create("r1");
        const c = RegionId.create("r2");
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
    });
});

describe("LocationId", () => {
    it("test_creation_succeeds_with_valid_id", () => {
        expect(LocationId.create("loc-1").getValue()).toBe("loc-1");
    });

    it("test_creation_throws_with_empty_id", () => {
        expect(() => LocationId.create("")).toThrow();
    });

    it("test_equality_works_correctly", () => {
        const a = LocationId.create("l1");
        const b = LocationId.create("l1");
        expect(a.equals(b)).toBe(true);
    });
});

