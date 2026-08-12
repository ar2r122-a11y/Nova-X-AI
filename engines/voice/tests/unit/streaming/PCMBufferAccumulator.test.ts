import { describe, it, expect, vi, beforeEach } from "vitest";
import { PCMBufferAccumulator } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0, dataSize = 1024): AudioChunk => {
    const data = new ArrayBuffer(dataSize);
    const view = new Uint8Array(data);
    for (let i = 0; i < dataSize; i++) {
        view[i] = (sequence * 256 + i) % 256;
    }
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("PCMBufferAccumulator", () => {
    let accumulator: PCMBufferAccumulator;

    beforeEach(() => {
        accumulator = new PCMBufferAccumulator();
    });

    describe("accumulate", () => {

        it("adds chunk data to the buffer", () => {
            accumulator.accumulate(makeChunk(0, 1024));
            expect(accumulator.getSize()).toBe(1024);
        });

        it("accumulates multiple chunks", () => {
            accumulator.accumulate(makeChunk(0, 512));
            accumulator.accumulate(makeChunk(1, 512));
            expect(accumulator.getSize()).toBe(1024);
        });

        it("flattens chunk byte data into the buffer", () => {
            const data = new ArrayBuffer(4);
            const view = new Uint8Array(data);
            view[0] = 10;
            view[1] = 20;
            view[2] = 30;
            view[3] = 40;
            const chunk = AudioChunk.create(AudioChunkSequence.create(0), data, Date.now(), false, AudioCodec.pcm());
            accumulator.accumulate(chunk);
            expect(accumulator.getSize()).toBe(4);
        });

    });

    describe("getBuffer", () => {

        it("returns a PCMBuffer with the accumulated data", () => {
            accumulator.accumulate(makeChunk(0, 1024));
            const buffer = accumulator.getBuffer();
            expect(buffer.getByteLength()).toBe(1024);
            expect(buffer.getSampleRate().getValue()).toBe(24000);
            expect(buffer.getBitDepth().getValue()).toBe(16);
            expect(buffer.getChannels()).toBe(1);
        });

        it("returns a PCMBuffer with concatenated data from multiple chunks", () => {
            accumulator.accumulate(makeChunk(0, 512));
            accumulator.accumulate(makeChunk(1, 512));
            const buffer = accumulator.getBuffer();
            expect(buffer.getByteLength()).toBe(1024);
        });

    });

    describe("clear", () => {

        it("empties the buffer", () => {
            accumulator.accumulate(makeChunk(0, 1024));
            accumulator.clear();
            expect(accumulator.getSize()).toBe(0);
        });

        it("allows accumulation after clear", () => {
            accumulator.accumulate(makeChunk(0, 1024));
            accumulator.clear();
            accumulator.accumulate(makeChunk(1, 512));
            expect(accumulator.getSize()).toBe(512);
        });

    });

    describe("maxSize", () => {

        it("respects the maxSize limit", () => {
            const limitedAccumulator = new PCMBufferAccumulator(100);
            limitedAccumulator.accumulate(makeChunk(0, 50));
            limitedAccumulator.accumulate(makeChunk(1, 50));
            expect(limitedAccumulator.getSize()).toBe(100);
        });

        it("allows data up to maxSize", () => {
            const limitedAccumulator = new PCMBufferAccumulator(100);
            limitedAccumulator.accumulate(makeChunk(0, 100));
            expect(limitedAccumulator.getSize()).toBe(100);
        });

    });

});
