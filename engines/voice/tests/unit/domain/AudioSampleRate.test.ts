import { describe, it, expect } from "vitest";
import { AudioSampleRate } from "../../../src/Domain/ValueObjects/AudioSampleRate";

describe("AudioSampleRate", () => {

    describe("hz24000", () => {

        it("returns a sample rate of 24000", () => {
            const rate = AudioSampleRate.hz24000();
            expect(rate.getValue()).toBe(24000);
        });

    });

    describe("hz44100", () => {

        it("returns a sample rate of 44100", () => {
            const rate = AudioSampleRate.hz44100();
            expect(rate.getValue()).toBe(44100);
        });

    });

    describe("create", () => {

        it("creates a sample rate of 16000 via create", () => {
            const rate = AudioSampleRate.create(16000);
            expect(rate.getValue()).toBe(16000);
        });

        it("throws for an unsupported sample rate", () => {
            expect(() => AudioSampleRate.create(9999)).toThrow("Invalid AudioSampleRate: 9999");
        });

    });

    describe("getValue", () => {

        it("returns the stored sample rate value", () => {
            const rate = AudioSampleRate.create(22050);
            expect(rate.getValue()).toBe(22050);
        });

    });

});
