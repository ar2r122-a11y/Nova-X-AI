import { describe, it, expect } from "vitest";
import { ProviderHealthySpecification } from "../../../src/Domain/Specifications/index";

describe("ProviderHealthySpecification", () => {

    describe("isSatisfiedBy", () => {

        it("returns true for healthy status", () => {
            expect(ProviderHealthySpecification.isSatisfiedBy("healthy")).toBe(true);
        });

        it("returns true for degraded status", () => {
            expect(ProviderHealthySpecification.isSatisfiedBy("degraded")).toBe(true);
        });

        it("returns false for unhealthy status", () => {
            expect(ProviderHealthySpecification.isSatisfiedBy("unhealthy")).toBe(false);
        });

    });

});
