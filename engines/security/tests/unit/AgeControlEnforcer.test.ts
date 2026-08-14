import { describe, it, expect } from "vitest";
import { AgeControlEnforcer } from "../../src/Infrastructure/AgeControl/AgeControlEnforcer";
import type { AgeControl } from "../../src/Domain/Entities";

describe("AgeControlEnforcer", () => {
    const enforcer = new AgeControlEnforcer();

    const childControl: AgeControl = {
        controlId: "control-1",
        identityId: "id-1",
        ageRating: "child",
        blockedContentTypes: ["violence", "scary"],
        allowedContentTypes: ["educational", "cartoon"],
        requiresParentalConsent: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    it("should allow educational content for child", () => {
        const result = enforcer.enforce(childControl, "educational");
        expect(result.allowed).toBe(true);
    });

    it("should block violence for child", () => {
        const result = enforcer.enforce(childControl, "violence");
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain("exceeds user age group");
    });

    it("should block content exceeding age rating", () => {
        const result = enforcer.enforce(childControl, "mature_themes");
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain("exceeds user age group");
    });

    it("should allow allowed content types for teen", () => {
        const teenControl: AgeControl = {
            ...childControl,
            controlId: "control-2",
            ageRating: "teen",
            allowedContentTypes: ["mild_adventure"]
        };
        const result = enforcer.enforce(teenControl, "mild_adventure");
        expect(result.allowed).toBe(true);
    });
});
