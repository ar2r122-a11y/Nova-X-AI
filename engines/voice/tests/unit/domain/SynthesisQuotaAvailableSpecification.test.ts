import { describe, it, expect } from "vitest";
import { SynthesisQuotaAvailableSpecification } from "../../../src/Domain/Specifications/index";

describe("SynthesisQuotaAvailableSpecification", () => {

    describe("isSatisfiedBy", () => {

        it("returns true when quota is available", () => {
            expect(SynthesisQuotaAvailableSpecification.isSatisfiedBy(10, 1000, 1000)).toBe(true);
        });

        it("returns false when daily limit is reached", () => {
            expect(SynthesisQuotaAvailableSpecification.isSatisfiedBy(1000, 0, 1000)).toBe(false);
        });

        it("returns false when monthly limit would be exceeded", () => {
            expect(SynthesisQuotaAvailableSpecification.isSatisfiedBy(10, 3600000, 1)).toBe(false);
        });

    });

});
