import { describe, it, expect } from "vitest";
import { AudioBitDepth } from "../../../src/Domain/ValueObjects/AudioBitDepth";

describe("AudioBitDepth", () => {

    describe("bit16", () => {

        it("returns a bit depth of 16", () => {
            const depth = AudioBitDepth.bit16();
            expect(depth.getValue()).toBe(16);
        });

    });

    describe("bit24", () => {

        it("returns a bit depth of 24", () => {
            const depth = AudioBitDepth.bit24();
            expect(depth.getValue()).toBe(24);
        });

    });

    describe("create", () => {

        it("creates a bit depth of 32 via create", () => {
            const depth = AudioBitDepth.create(32);
            expect(depth.getValue()).toBe(32);
        });

        it("throws for an unsupported bit depth", () => {
            expect(() => AudioBitDepth.create(8)).toThrow("Invalid AudioBitDepth: 8");
        });

    });

    describe("getValue", () => {

        it("returns the stored bit depth value", () => {
            const depth = AudioBitDepth.create(16);
            expect(depth.getValue()).toBe(16);
        });

    });

});
