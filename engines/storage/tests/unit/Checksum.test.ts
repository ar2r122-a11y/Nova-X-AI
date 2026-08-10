import { describe, it, expect } from "vitest";
import { Checksum } from "../../src/Domain/ValueObjects/index.ts";

describe("Checksum", () => {
    it("should create checksum from string", () => {
        const checksum = Checksum.create("hello");
        expect(checksum.getValue()).toContain("sha256-");
    });

    it("should compare equal", () => {
        const a = Checksum.create("hello");
        const b = Checksum.create("hello");
        expect(a.equals(b)).toBe(true);
    });
});
