import { describe, it, expect } from "vitest";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";

describe("AudioChunkSequence", () => {

    describe("create", () => {

        it("creates a sequence with the given value", () => {
            const seq = AudioChunkSequence.create(5);
            expect(seq.getValue()).toBe(5);
        });

        it("throws when the value is negative", () => {
            expect(() => AudioChunkSequence.create(-1)).toThrow("AudioChunkSequence cannot be negative.");
        });

    });

    describe("initial", () => {

        it("creates a sequence with value 0", () => {
            const seq = AudioChunkSequence.initial();
            expect(seq.getValue()).toBe(0);
        });

    });

    describe("getValue", () => {

        it("returns the stored sequence value", () => {
            const seq = AudioChunkSequence.create(42);
            expect(seq.getValue()).toBe(42);
        });

    });

});
