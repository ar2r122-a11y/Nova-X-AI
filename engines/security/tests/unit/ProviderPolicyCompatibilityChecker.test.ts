import { describe, it, expect } from "vitest";
import { ProviderPolicyCompatibilityChecker } from "../../src/Infrastructure/ProviderPolicy/ProviderPolicyCompatibilityChecker";
import type { ProviderPolicy } from "../../src/Domain/Entities";

describe("ProviderPolicyCompatibilityChecker", () => {
    const checker = new ProviderPolicyCompatibilityChecker();

    const compatiblePolicy: ProviderPolicy = {
        policyId: "policy-1",
        providerId: "openai",
        providerName: "OpenAI",
        allowedContentCategories: ["chat", "code"],
        blockedContentCategories: ["nsfw"],
        safetySettings: {},
        compatible: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    it("should allow compatible content", () => {
        const result = checker.checkCompatibility(compatiblePolicy, "chat");
        expect(result.compatible).toBe(true);
    });

    it("should block incompatible provider", () => {
        const incompatiblePolicy: ProviderPolicy = {
            ...compatiblePolicy,
            policyId: "policy-2",
            compatible: false
        };
        const result = checker.checkCompatibility(incompatiblePolicy, "chat");
        expect(result.compatible).toBe(false);
        expect(result.reason).toContain("incompatible");
    });

    it("should block content category by provider", () => {
        const result = checker.checkCompatibility(compatiblePolicy, "nsfw");
        expect(result.compatible).toBe(false);
        expect(result.reason).toContain("blocked by provider");
    });
});
