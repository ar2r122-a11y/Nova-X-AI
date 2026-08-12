import { describe, it, expect } from "vitest";
import { VoiceSessionId } from "../../../src/Domain/ValueObjects/VoiceSessionId";

describe("VoiceSessionId", () => {

    describe("create", () => {

        it("creates a VoiceSessionId from a valid string", () => {
            const id = VoiceSessionId.create("session-123");
            expect(id.getValue()).toBe("session-123");
        });

        it("trims whitespace from the input", () => {
            const id = VoiceSessionId.create("  session-123  ");
            expect(id.getValue()).toBe("session-123");
        });

        it("throws when the input is empty", () => {
            expect(() => VoiceSessionId.create("")).toThrow("VoiceSessionId cannot be empty.");
        });

        it("throws when the input is only whitespace", () => {
            expect(() => VoiceSessionId.create("   ")).toThrow("VoiceSessionId cannot be empty.");
        });

    });

    describe("generate", () => {

        it("generates a unique VoiceSessionId with the expected prefix", () => {
            const id = VoiceSessionId.generate();
            expect(id.getValue()).toMatch(/^session-\d+-[a-z0-9]+$/);
        });

        it("generates different values on successive calls", () => {
            const id1 = VoiceSessionId.generate();
            const id2 = VoiceSessionId.generate();
            expect(id1.getValue()).not.toBe(id2.getValue());
        });

    });

    describe("equals", () => {

        it("returns true for equal values", () => {
            const a = VoiceSessionId.create("session-123");
            const b = VoiceSessionId.create("session-123");
            expect(a.equals(b)).toBe(true);
        });

        it("returns false for different values", () => {
            const a = VoiceSessionId.create("session-123");
            const b = VoiceSessionId.create("session-456");
            expect(a.equals(b)).toBe(false);
        });

    });

});
