import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioResponseMerger } from "../../../src/Infrastructure/Provider";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("AudioResponseMerger", () => {
    let merger: AudioResponseMerger;

    beforeEach(() => {
        merger = new AudioResponseMerger();
    });

    describe("merge", () => {

        it("returns the input chunks unchanged", () => {
            const chunks = [makeChunk(0), makeChunk(1), makeChunk(2)];
            const result = merger.merge(chunks);
            expect(result).toBe(chunks);
        });

        it("returns an empty array when given an empty array", () => {
            const result = merger.merge([]);
            expect(result).toEqual([]);
        });

        it("preserves chunk order", () => {
            const chunks = [makeChunk(5), makeChunk(10), makeChunk(15)];
            const result = merger.merge(chunks);
            expect(result[0].getSequence().getValue()).toBe(5);
            expect(result[1].getSequence().getValue()).toBe(10);
            expect(result[2].getSequence().getValue()).toBe(15);
        });

        it("does not mutate the original array", () => {
            const chunks = [makeChunk(0), makeChunk(1)];
            const originalLength = chunks.length;
            merger.merge(chunks);
            expect(chunks.length).toBe(originalLength);
        });

    });

});
