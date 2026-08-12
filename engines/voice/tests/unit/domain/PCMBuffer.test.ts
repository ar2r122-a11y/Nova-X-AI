import { describe, it, expect } from "vitest";
import { PCMBuffer } from "../../../src/Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../../src/Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../../src/Domain/ValueObjects/AudioBitDepth";

describe("PCMBuffer", () => {

    const makeData = (size: number): ArrayBuffer => new ArrayBuffer(size);

    describe("create", () => {

        it("creates a PCMBuffer with valid parameters", () => {
            const buffer = PCMBuffer.create(makeData(1024), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 2);
            expect(buffer).toBeDefined();
        });

        it("throws when data is empty", () => {
            expect(() => PCMBuffer.create(new ArrayBuffer(0), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1))
                .toThrow("PCMBuffer data cannot be empty.");
        });

        it("throws when channels is 0", () => {
            expect(() => PCMBuffer.create(makeData(1024), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 0))
                .toThrow("PCMBuffer channels must be 1 or 2.");
        });

        it("throws when channels is greater than 2", () => {
            expect(() => PCMBuffer.create(makeData(1024), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 3))
                .toThrow("PCMBuffer channels must be 1 or 2.");
        });

    });

    describe("empty", () => {

        it("creates an empty PCMBuffer with the given metadata", () => {
            const buffer = PCMBuffer.empty(AudioSampleRate.hz44100(), AudioBitDepth.bit24(), 1);
            expect(buffer.isEmpty()).toBe(true);
            expect(buffer.getSampleRate().getValue()).toBe(44100);
            expect(buffer.getBitDepth().getValue()).toBe(24);
            expect(buffer.getChannels()).toBe(1);
        });

    });

    describe("getData", () => {

        it("returns the underlying ArrayBuffer", () => {
            const data = makeData(512);
            const buffer = PCMBuffer.create(data, AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            expect(buffer.getData()).toBe(data);
        });

    });

    describe("getSampleRate", () => {

        it("returns the sample rate passed during creation", () => {
            const buffer = PCMBuffer.create(makeData(512), AudioSampleRate.hz44100(), AudioBitDepth.bit16(), 1);
            expect(buffer.getSampleRate().getValue()).toBe(44100);
        });

    });

    describe("getBitDepth", () => {

        it("returns the bit depth passed during creation", () => {
            const buffer = PCMBuffer.create(makeData(512), AudioSampleRate.hz24000(), AudioBitDepth.bit24(), 1);
            expect(buffer.getBitDepth().getValue()).toBe(24);
        });

    });

    describe("getChannels", () => {

        it("returns the channel count passed during creation", () => {
            const buffer = PCMBuffer.create(makeData(512), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 2);
            expect(buffer.getChannels()).toBe(2);
        });

    });

    describe("getByteLength", () => {

        it("returns the byte length of the data", () => {
            const buffer = PCMBuffer.create(makeData(2048), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            expect(buffer.getByteLength()).toBe(2048);
        });

        it("returns 0 for an empty buffer", () => {
            const buffer = PCMBuffer.empty(AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            expect(buffer.getByteLength()).toBe(0);
        });

    });

    describe("isEmpty", () => {

        it("returns false for a non-empty buffer", () => {
            const buffer = PCMBuffer.create(makeData(1024), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            expect(buffer.isEmpty()).toBe(false);
        });

        it("returns true for an empty buffer", () => {
            const buffer = PCMBuffer.empty(AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            expect(buffer.isEmpty()).toBe(true);
        });

    });

    describe("concat", () => {

        it("concatenates two PCMBuffers into one", () => {
            const a = PCMBuffer.create(makeData(4), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            const b = PCMBuffer.create(makeData(6), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            const result = a.concat(b);
            expect(result.getByteLength()).toBe(10);
            expect(result.getSampleRate().getValue()).toBe(24000);
            expect(result.getBitDepth().getValue()).toBe(16);
            expect(result.getChannels()).toBe(1);
        });

    });

    describe("slice", () => {

        it("returns a slice of the buffer", () => {
            const buffer = PCMBuffer.create(makeData(10), AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
            const sliced = buffer.slice(2, 6);
            expect(sliced.getByteLength()).toBe(4);
        });

    });

});
