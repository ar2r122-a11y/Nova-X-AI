import { describe, it, expect } from "vitest";
import { StorageKey } from "../../src/Domain/ValueObjects/index.ts";

describe("StorageKey", () => {
    it("should create from collection and id", () => {
        const key = StorageKey.create("characters", "123");
        expect(key.getValue()).toBe("characters:123");
        expect(key.getCollection()).toBe("characters");
        expect(key.getId()).toBe("123");
    });

    it("should compare equal", () => {
        const a = StorageKey.create("events", "1");
        const b = StorageKey.create("events", "1");
        expect(a.equals(b)).toBe(true);
    });
});
