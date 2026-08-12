import { describe, it, expect } from "vitest";
import { SynthesisQuotaPolicy } from "../../../src/Domain/Policies/SynthesisQuotaPolicy";

describe("SynthesisQuotaPolicy", () => {

    describe("validateInputLength", () => {

        it("does not throw for text within the limit", () => {
            const text = "a".repeat(SynthesisQuotaPolicy.MAX_INPUT_CHARACTERS);
            expect(() => SynthesisQuotaPolicy.validateInputLength(text)).not.toThrow();
        });

        it("throws when text exceeds the maximum length", () => {
            const text = "a".repeat(SynthesisQuotaPolicy.MAX_INPUT_CHARACTERS + 1);
            expect(() => SynthesisQuotaPolicy.validateInputLength(text))
                .toThrow(`Input text exceeds maximum length of ${SynthesisQuotaPolicy.MAX_INPUT_CHARACTERS} characters.`);
        });

    });

    describe("canSynthesize", () => {

        it("returns true when under daily and monthly limits", () => {
            const result = SynthesisQuotaPolicy.canSynthesize(10, 1000, 1000);
            expect(result).toBe(true);
        });

        it("returns false when daily count is at the limit", () => {
            const result = SynthesisQuotaPolicy.canSynthesize(
                SynthesisQuotaPolicy.MAX_DAILY_SYNTHESIS_REQUESTS,
                1000,
                1000
            );
            expect(result).toBe(false);
        });

        it("returns false when monthly duration would exceed the limit", () => {
            const result = SynthesisQuotaPolicy.canSynthesize(10, 3600000, 1);
            expect(result).toBe(false);
        });

        it("returns true when monthly duration is exactly at the limit", () => {
            const result = SynthesisQuotaPolicy.canSynthesize(10, 3599000, 1000);
            expect(result).toBe(true);
        });

    });

});
