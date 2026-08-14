import { describe, it, expect } from "vitest";
import { Checksum } from "../../src/Domain/ValueObjects/index.ts";

describe("Checksum", () => {
    it("should create checksum from string", async () => {
        const checksum = await Checksum.create("hello");
        expect(checksum.getValue()).toContain("sha256-");
    });

    it("should compare equal", async () => {
        const a = await Checksum.create("hello");
        const b = await Checksum.create("hello");
        expect(a.equals(b)).toBe(true);
    });
});
