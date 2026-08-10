import { describe, it, expect } from "vitest";
import { Delta } from "../../src/Domain/ValueObjects/index.ts";

describe("Delta", () => {
    it("should create empty delta", () => {
        const delta = Delta.create();
        expect(delta.isEmpty()).toBe(true);
    });

    it("should add change", () => {
        const delta = Delta.create().addChange("name", "old", "new");
        expect(delta.isEmpty()).toBe(false);
        expect(delta.getChanges().size).toBe(1);
    });
});
