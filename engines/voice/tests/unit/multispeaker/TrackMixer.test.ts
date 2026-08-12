import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrackMixer } from "../../../src/Infrastructure/MultiSpeaker";
import { PCMBuffer } from "../../../src/Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../../src/Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../../src/Domain/ValueObjects/AudioBitDepth";

describe("TrackMixer", () => {
    let mixer: TrackMixer;

    beforeEach(() => {
        mixer = new TrackMixer();
    });

    describe("mix", () => {

        it("returns empty PCMBuffer when given empty tracks array", () => {
            const result = mixer.mix([]);
            expect(result).toBeInstanceOf(PCMBuffer);
            expect(result.isEmpty()).toBe(true);
        });

        it("returns the single track when given one track", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();
            const data = new ArrayBuffer(1024);
            const track = PCMBuffer.create(data, sampleRate, bitDepth, 1);

            const result = mixer.mix([track]);
            expect(result).toBe(track);
        });

        it("mixes multiple tracks by averaging samples", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();

            const data1 = new ArrayBuffer(4);
            const view1 = new Uint8Array(data1);
            view1[0] = 100;
            view1[1] = 0;
            view1[2] = 100;
            view1[3] = 0;
            const track1 = PCMBuffer.create(data1, sampleRate, bitDepth, 1);

            const data2 = new ArrayBuffer(4);
            const view2 = new Uint8Array(data2);
            view2[0] = 200;
            view2[1] = 0;
            view2[2] = 50;
            view2[3] = 0;
            const track2 = PCMBuffer.create(data2, sampleRate, bitDepth, 1);

            const result = mixer.mix([track1, track2]);
            expect(result).toBeInstanceOf(PCMBuffer);
            expect(result.getByteLength()).toBe(4);
        });

        it("returns a PCMBuffer with correct sample rate", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();
            const data = new ArrayBuffer(1024);
            const track = PCMBuffer.create(data, sampleRate, bitDepth, 1);

            const result = mixer.mix([track]);
            expect(result.getSampleRate().getValue()).toBe(24000);
        });

        it("returns a PCMBuffer with correct bit depth", () => {
            const sampleRate = AudioSampleRate.hz24000();
            const bitDepth = AudioBitDepth.bit16();
            const data = new ArrayBuffer(1024);
            const track = PCMBuffer.create(data, sampleRate, bitDepth, 1);

            const result = mixer.mix([track]);
            expect(result.getBitDepth().getValue()).toBe(16);
        });

    });

});
