import { describe, it, expect } from "vitest";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";

describe("VoiceId", () => {

    describe("create", () => {

        it("creates a VoiceId from a valid string", () => {
            const id = VoiceId.create("voice-123");
            expect(id.getValue()).toBe("voice-123");
        });

        it("trims whitespace from the input", () => {
            const id = VoiceId.create("  voice-123  ");
            expect(id.getValue()).toBe("voice-123");
        });

        it("throws when the input is empty", () => {
            expect(() => VoiceId.create("")).toThrow("VoiceId cannot be empty.");
        });

        it("throws when the input is only whitespace", () => {
            expect(() => VoiceId.create("   ")).toThrow("VoiceId cannot be empty.");
        });

    });

    describe("generate", () => {

        it("generates a unique VoiceId with the expected prefix", () => {
            const id = VoiceId.generate();
            expect(id.getValue()).toMatch(/^voice-\d+-[a-z0-9]+$/);
        });

        it("generates different values on successive calls", () => {
            const id1 = VoiceId.generate();
            const id2 = VoiceId.generate();
            expect(id1.getValue()).not.toBe(id2.getValue());
        });

    });

    describe("equals", () => {

        it("returns true for equal values", () => {
            const a = VoiceId.create("voice-123");
            const b = VoiceId.create("voice-123");
            expect(a.equals(b)).toBe(true);
        });

        it("returns false for different values", () => {
            const a = VoiceId.create("voice-123");
            const b = VoiceId.create("voice-456");
            expect(a.equals(b)).toBe(false);
        });

    });

    describe("getValue", () => {

        it("returns the stored string value", () => {
            const id = VoiceId.create("voice-abc");
            expect(id.getValue()).toBe("voice-abc");
        });

    });

});
