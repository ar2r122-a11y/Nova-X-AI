import { describe, it, expect } from "vitest";
import { StartStoryValidator } from "../../../src/Application/Validators/StartStoryValidator";
import { StartStoryCommand } from "../../../src/Application/Commands/StartStoryCommand";

describe("StartStoryValidator", () => {
    it("should pass valid command", () => {
        const command = new StartStoryCommand("123e4567-e89b-12d3-a456-426614174000", "Title", "Desc", { roles: [] });
        expect(() => StartStoryValidator.validate(command)).not.toThrow();
    });

    it("should throw on empty storyId", () => {
        const command = new StartStoryCommand("", "Title", "Desc", { roles: [] });
        expect(() => StartStoryValidator.validate(command)).toThrow("StoryId is required.");
    });

    it("should throw on empty title", () => {
        const command = new StartStoryCommand("123e4567-e89b-12d3-a456-426614174000", "", "Desc", { roles: [] });
        expect(() => StartStoryValidator.validate(command)).toThrow("Title is required.");
    });
});
