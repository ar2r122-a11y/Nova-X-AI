import { describe, it, expect } from "vitest";
import { SchemaVersion } from "../../src/Domain/ValueObjects/index.ts";

describe("SchemaVersion", () => {
    it("should create version", () => {
        const v = SchemaVersion.create(1, 2, 3);
        expect(v.toString()).toBe("1.2.3");
    });

    it("should parse version", () => {
        const v = SchemaVersion.parse("2.0.0");
        expect(v.toString()).toBe("2.0.0");
    });

    it("should compare greater than", () => {
        const a = SchemaVersion.create(2, 0, 0);
        const b = SchemaVersion.create(1, 9, 9);
        expect(a.isGreaterThan(b)).toBe(true);
    });
});
