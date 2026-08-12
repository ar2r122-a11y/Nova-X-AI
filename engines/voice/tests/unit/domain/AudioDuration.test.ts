import { describe, it, expect } from "vitest";
import { AudioDuration } from "../../../src/Domain/ValueObjects/AudioDuration";

describe("AudioDuration", () => {

    describe("create", () => {

        it("creates an AudioDuration from a positive number of milliseconds", () => {
            const duration = AudioDuration.create(5000);
            expect(duration.getValue()).toBe(5000);
        });

        it("creates an AudioDuration of zero", () => {
            const duration = AudioDuration.create(0);
            expect(duration.getValue()).toBe(0);
        });

        it("throws when milliseconds is negative", () => {
            expect(() => AudioDuration.create(-1)).toThrow("AudioDuration cannot be negative.");
        });

    });

    describe("getValue", () => {

        it("returns the stored milliseconds value", () => {
            const duration = AudioDuration.create(3500);
            expect(duration.getValue()).toBe(3500);
        });

    });

});
