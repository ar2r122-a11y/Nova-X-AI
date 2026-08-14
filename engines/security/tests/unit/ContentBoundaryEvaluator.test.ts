import { describe, it, expect } from "vitest";
import { ContentBoundaryEvaluator } from "../../src/Infrastructure/ContentBoundary/ContentBoundaryEvaluator";
import type { ContentBoundary } from "../../src/Domain/Entities";

describe("ContentBoundaryEvaluator", () => {
    const evaluator = new ContentBoundaryEvaluator();

    const boundary: ContentBoundary = {
        boundaryId: "boundary-1",
        name: "test-boundary",
        description: "Test boundary",
        allowedCategories: ["safe", "educational"],
        blockedCategories: ["nsfw", "violence"],
        severityThreshold: "medium",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    it("should allow content in allowed list", () => {
        const result = evaluator.evaluate(boundary, "safe");
        expect(result.allowed).toBe(true);
    });

    it("should block content in blocked list", () => {
        const result = evaluator.evaluate(boundary, "nsfw");
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain("nsfw");
    });

    it("should block content not in allowed list when allowlist is used", () => {
        const result = evaluator.evaluate(boundary, "unknown");
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain("not in allowed list");
    });

    it("should allow content when allowlist is empty", () => {
        const openBoundary: ContentBoundary = {
            ...boundary,
            boundaryId: "boundary-2",
            allowedCategories: [],
            blockedCategories: ["nsfw"]
        };
        const result = evaluator.evaluate(openBoundary, "anything");
        expect(result.allowed).toBe(true);
    });
});
