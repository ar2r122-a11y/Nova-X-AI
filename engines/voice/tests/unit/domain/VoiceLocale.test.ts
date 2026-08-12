import { describe, it, expect } from "vitest";
import { VoiceLocale } from "../../../src/Domain/ValueObjects/VoiceLocale";

describe("VoiceLocale", () => {

    describe("create", () => {

        it("creates a locale from a valid language code", () => {
            const locale = VoiceLocale.create("en");
            expect(locale.getValue()).toBe("en");
        });

        it("creates a locale from a valid region code", () => {
            const locale = VoiceLocale.create("en-US");
            expect(locale.getValue()).toBe("en-US");
        });

        it("throws when the input is empty", () => {
            expect(() => VoiceLocale.create("")).toThrow("VoiceLocale cannot be empty.");
        });

        it("throws when the input is only whitespace", () => {
            expect(() => VoiceLocale.create("   ")).toThrow("VoiceLocale cannot be empty.");
        });

        it("throws for an invalid format", () => {
            expect(() => VoiceLocale.create("english")).toThrow("Invalid VoiceLocale format: english");
        });

        it("throws for an invalid region format", () => {
            expect(() => VoiceLocale.create("en-us")).toThrow("Invalid VoiceLocale format: en-us");
        });

    });

    describe("getValue", () => {

        it("returns the stored locale value", () => {
            const locale = VoiceLocale.create("fr-FR");
            expect(locale.getValue()).toBe("fr-FR");
        });

    });

});
