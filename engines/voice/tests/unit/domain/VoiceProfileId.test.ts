import { describe, it, expect } from "vitest";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";

describe("VoiceProfileId", () => {

    describe("create", () => {

        it("creates a VoiceProfileId from a valid string", () => {
            const id = VoiceProfileId.create("profile-123");
            expect(id.getValue()).toBe("profile-123");
        });

        it("trims whitespace from the input", () => {
            const id = VoiceProfileId.create("  profile-123  ");
            expect(id.getValue()).toBe("profile-123");
        });

        it("throws when the input is empty", () => {
            expect(() => VoiceProfileId.create("")).toThrow("VoiceProfileId cannot be empty.");
        });

        it("throws when the input is only whitespace", () => {
            expect(() => VoiceProfileId.create("   ")).toThrow("VoiceProfileId cannot be empty.");
        });

    });

    describe("generate", () => {

        it("generates a unique VoiceProfileId with the expected prefix", () => {
            const id = VoiceProfileId.generate();
            expect(id.getValue()).toMatch(/^profile-\d+-[a-z0-9]+$/);
        });

        it("generates different values on successive calls", () => {
            const id1 = VoiceProfileId.generate();
            const id2 = VoiceProfileId.generate();
            expect(id1.getValue()).not.toBe(id2.getValue());
        });

    });

    describe("equals", () => {

        it("returns true for equal values", () => {
            const a = VoiceProfileId.create("profile-123");
            const b = VoiceProfileId.create("profile-123");
            expect(a.equals(b)).toBe(true);
        });

        it("returns false for different values", () => {
            const a = VoiceProfileId.create("profile-123");
            const b = VoiceProfileId.create("profile-456");
            expect(a.equals(b)).toBe(false);
        });

    });

});
