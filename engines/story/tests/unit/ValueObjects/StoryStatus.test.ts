import { describe, it, expect } from "vitest";
import { StoryStatusRef } from "../../../src/Domain/ValueObjects/StoryStatus";

describe("StoryStatusRef", () => {
    it("should create valid statuses", () => {
        expect(StoryStatusRef.create("draft").getValue()).toBe("draft");
        expect(StoryStatusRef.create("active").getValue()).toBe("active");
        expect(StoryStatusRef.create("paused").getValue()).toBe("paused");
        expect(StoryStatusRef.create("completed").getValue()).toBe("completed");
        expect(StoryStatusRef.create("failed").getValue()).toBe("failed");
        expect(StoryStatusRef.create("archived").getValue()).toBe("archived");
    });

    it("should throw on invalid status", () => {
        expect(() => StoryStatusRef.create("invalid")).toThrow("Invalid StoryStatus");
    });

    it("should return initial status", () => {
        expect(StoryStatusRef.initial().getValue()).toBe("draft");
    });

    it("should compare equality", () => {
        const a = StoryStatusRef.create("active");
        const b = StoryStatusRef.active();
        expect(a.equals(b)).toBe(true);
    });
});
