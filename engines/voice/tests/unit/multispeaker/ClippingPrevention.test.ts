import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClippingPrevention } from "../../../src/Infrastructure/MultiSpeaker";
import { PCMBuffer } from "../../../src/Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../../src/Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../../src/Domain/ValueObjects/AudioBitDepth";

describe("ClippingPrevention", () => {
    let prevention: ClippingPrevention;

    beforeEach(() => {
        prevention = new ClippingPrevention();
    });

    describe("prevent", () => {

        it("returns the same buffer (passthrough)", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();
            const data = new ArrayBuffer(1024);
            const buffer = PCMBuffer.create(data, sampleRate, bitDepth, 1);

            const result = prevention.prevent(buffer);
            expect(result).toBe(buffer);
        });

        it("returns empty buffer unchanged", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();
            const buffer = PCMBuffer.empty(sampleRate, bitDepth, 1);

            const result = prevention.prevent(buffer);
            expect(result).toBe(buffer);
            expect(result.isEmpty()).toBe(true);
        });

    });

});
