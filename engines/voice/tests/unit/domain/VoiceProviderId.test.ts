import { describe, it, expect } from "vitest";
import { VoiceProviderId } from "../../../src/Domain/ValueObjects/VoiceProviderId";

describe("VoiceProviderId", () => {

    describe("create", () => {

        it("creates a VoiceProviderId from a valid string", () => {
            const id = VoiceProviderId.create("provider-1");
            expect(id.getValue()).toBe("provider-1");
        });

        it("trims whitespace from the input", () => {
            const id = VoiceProviderId.create("  provider-1  ");
            expect(id.getValue()).toBe("provider-1");
        });

        it("throws when the input is empty", () => {
            expect(() => VoiceProviderId.create("")).toThrow("VoiceProviderId cannot be empty.");
        });

        it("throws when the input is only whitespace", () => {
            expect(() => VoiceProviderId.create("   ")).toThrow("VoiceProviderId cannot be empty.");
        });

    });

    describe("equals", () => {

        it("returns true for equal values", () => {
            const a = VoiceProviderId.create("provider-1");
            const b = VoiceProviderId.create("provider-1");
            expect(a.equals(b)).toBe(true);
        });

        it("returns false for different values", () => {
            const a = VoiceProviderId.create("provider-1");
            const b = VoiceProviderId.create("provider-2");
            expect(a.equals(b)).toBe(false);
        });

    });

    describe("getValue", () => {

        it("returns the stored string value", () => {
            const id = VoiceProviderId.create("provider-abc");
            expect(id.getValue()).toBe("provider-abc");
        });

    });

});
