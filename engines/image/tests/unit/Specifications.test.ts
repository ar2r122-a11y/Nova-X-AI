import { describe, it, expect } from "vitest";
import { IsValidDimensionSpecification } from "../../src/Domain/Specifications/IsValidDimensionSpecification";
import { IsAuthorizedSpecification } from "../../src/Domain/Specifications/IsAuthorizedSpecification";
import { HasAvailableBudgetSpecification } from "../../src/Domain/Specifications/HasAvailableBudgetSpecification";
import { IsProviderHealthySpecification } from "../../src/Domain/Specifications/IsProviderHealthySpecification";
import { IsPromptSafeSpecification } from "../../src/Domain/Specifications/IsPromptSafeSpecification";
import { ImageDimensions } from "../../src/Domain/ValueObjects/ImageDimensions";
import { ResourceBudget } from "../../src/Domain/ValueObjects/ResourceBudget";
import { ContentSafetyRating } from "../../src/Domain/ValueObjects/ContentSafetyRating";
import { SafetyViolationException } from "../../src/Domain/Exceptions/ImageExceptions";

describe("Specifications", () => {
    describe("IsValidDimensionSpecification", () => {
        it("should validate valid dimensions", () => {
            const spec = new IsValidDimensionSpecification(64, 64, 8192, 8192);
            expect(spec.isSatisfiedBy(ImageDimensions.create(512, 512))).toBe(true);
        });

        it("should reject too small dimensions", () => {
            const spec = new IsValidDimensionSpecification(64, 64, 8192, 8192);
            expect(spec.isSatisfiedBy(ImageDimensions.create(32, 32))).toBe(false);
        });

        it("should reject too large dimensions", () => {
            const spec = new IsValidDimensionSpecification(64, 64, 8192, 8192);
            expect(spec.isSatisfiedBy(ImageDimensions.create(16384, 16384))).toBe(false);
        });
    });

    describe("IsAuthorizedSpecification", () => {
        it("should authorize admin", () => {
            const spec = new IsAuthorizedSpecification(["admin", "user"]);
            expect(spec.isSatisfiedBy(["admin"])).toBe(true);
        });

        it("should authorize user", () => {
            const spec = new IsAuthorizedSpecification(["admin", "user"]);
            expect(spec.isSatisfiedBy(["user"])).toBe(true);
        });

        it("should reject unauthorized", () => {
            const spec = new IsAuthorizedSpecification(["admin", "user"]);
            expect(spec.isSatisfiedBy(["guest"])).toBe(false);
        });
    });

    describe("HasAvailableBudgetSpecification", () => {
        it("should be satisfied when budget available", () => {
            const spec = new HasAvailableBudgetSpecification();
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            expect(spec.isSatisfiedBy(budget)).toBe(true);
        });

        it("should not be satisfied when budget exhausted", () => {
            const spec = new HasAvailableBudgetSpecification();
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(1000, 2000, 5000);
            expect(spec.isSatisfiedBy(budget)).toBe(false);
        });
    });

    describe("IsProviderHealthySpecification", () => {
        it("should be satisfied for healthy provider", () => {
            const spec = new IsProviderHealthySpecification(["p1", "p2"]);
            expect(spec.isSatisfiedBy("p1")).toBe(true);
        });

        it("should not be satisfied for unhealthy provider", () => {
            const spec = new IsProviderHealthySpecification(["p1"]);
            expect(spec.isSatisfiedBy("p2")).toBe(false);
        });

        it("should update health status", () => {
            const spec = new IsProviderHealthySpecification(["p1"]);
            spec.markUnhealthy("p1");
            expect(spec.isSatisfiedBy("p1")).toBe(false);
            spec.markHealthy("p1");
            expect(spec.isSatisfiedBy("p1")).toBe(true);
        });
    });

    describe("IsPromptSafeSpecification", () => {
        it("should allow safe prompt", () => {
            const spec = new IsPromptSafeSpecification(["nsfw", "gore"]);
            expect(spec.isSatisfiedBy("a beautiful landscape", ContentSafetyRating.SAFE)).toBe(true);
        });

        it("should throw for unsafe rating", () => {
            const spec = new IsPromptSafeSpecification([]);
            expect(() => spec.isSatisfiedBy("test", ContentSafetyRating.UNSAFE)).toThrow(SafetyViolationException);
        });

        it("should throw for blocked terms", () => {
            const spec = new IsPromptSafeSpecification(["nsfw", "gore"]);
            expect(() => spec.isSatisfiedBy("nsfw content", ContentSafetyRating.SAFE)).toThrow(SafetyViolationException);
        });
    });
});
