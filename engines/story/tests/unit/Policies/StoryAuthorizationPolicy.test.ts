import { describe, it, expect } from "vitest";
import { StoryAuthorizationPolicy } from "../../../src/Domain/Policies/StoryAuthorizationPolicy";

describe("StoryAuthorizationPolicy", () => {
    it("should allow admin role", () => {
        expect(StoryAuthorizationPolicy.canStartStory("user1", { roles: ["admin"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canAdvanceScene("user1", { roles: ["admin"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canSelectChoice("user1", { roles: ["admin"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canCompleteStory("user1", { roles: ["admin"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canFailStory("user1", { roles: ["admin"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canUpdateQuest("user1", { roles: ["admin"] })).toBe(true);
    });

    it("should allow story:write role", () => {
        expect(StoryAuthorizationPolicy.canStartStory("user1", { roles: ["story:write"] })).toBe(true);
        expect(StoryAuthorizationPolicy.canAdvanceScene("user1", { roles: ["story:write"] })).toBe(true);
    });

    it("should deny unauthorized roles", () => {
        expect(StoryAuthorizationPolicy.canStartStory("user1", { roles: ["user"] })).toBe(false);
        expect(StoryAuthorizationPolicy.canAdvanceScene("user1", { roles: ["user"] })).toBe(false);
    });
});
