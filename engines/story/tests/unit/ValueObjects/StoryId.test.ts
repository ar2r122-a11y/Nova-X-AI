import { describe, it, expect } from "vitest";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";

describe("StoryId", () => {
    it("should create a valid StoryId", () => {
        const id = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        expect(id.getValue()).toBe("123e4567-e89b-12d3-a456-426614174000");
    });

    it("should throw on empty StoryId", () => {
        expect(() => StoryId.create("")).toThrow("StoryId cannot be empty.");
    });

    it("should throw on invalid UUID", () => {
        expect(() => StoryId.create("invalid")).toThrow("StoryId must be a valid UUID");
    });

    it("should generate a valid UUID", () => {
        const id = StoryId.generate();
        expect(id.getValue()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it("should compare equality", () => {
        const id1 = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const id2 = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const id3 = StoryId.create("123e4567-e89b-12d3-a456-426614174001");
        expect(id1.equals(id2)).toBe(true);
        expect(id1.equals(id3)).toBe(false);
    });
});
