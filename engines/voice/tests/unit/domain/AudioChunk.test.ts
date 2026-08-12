import { describe, it, expect } from "vitest";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

describe("AudioChunk", () => {

    const makeData = (size = 1024): ArrayBuffer => {
        const buffer = new ArrayBuffer(size);
        return buffer;
    };

    describe("create", () => {

        it("creates an AudioChunk with the given properties", () => {
            const sequence = AudioChunkSequence.create(5);
            const data = makeData();
            const codec = AudioCodec.pcm();
            const chunk = AudioChunk.create(sequence, data, 1000, false, codec);
            expect(chunk).toBeDefined();
        });

        it("throws when data is empty", () => {
            const sequence = AudioChunkSequence.initial();
            expect(() => AudioChunk.create(sequence, new ArrayBuffer(0), 1000, false, AudioCodec.pcm()))
                .toThrow("AudioChunk data cannot be empty.");
        });

    });

    describe("initial", () => {

        it("creates an initial AudioChunk with sequence 0", () => {
            const chunk = AudioChunk.initial(makeData());
            expect(chunk.getSequence().getValue()).toBe(0);
        });

        it("creates an initial AudioChunk with pcm codec", () => {
            const chunk = AudioChunk.initial(makeData());
            expect(chunk.getCodec().getValue()).toBe("pcm");
        });

        it("creates an initial AudioChunk with isLast false", () => {
            const chunk = AudioChunk.initial(makeData());
            expect(chunk.getIsLast()).toBe(false);
        });

    });

    describe("getSequence", () => {

        it("returns the sequence passed during creation", () => {
            const sequence = AudioChunkSequence.create(7);
            const chunk = AudioChunk.create(sequence, makeData(), 1000, false, AudioCodec.pcm());
            expect(chunk.getSequence().getValue()).toBe(7);
        });

    });

    describe("getData", () => {

        it("returns the ArrayBuffer passed during creation", () => {
            const data = makeData(2048);
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), data, 1000, false, AudioCodec.pcm());
            expect(chunk.getData()).toBe(data);
        });

    });

    describe("getTimestamp", () => {

        it("returns the timestamp passed during creation", () => {
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), makeData(), 5000, false, AudioCodec.pcm());
            expect(chunk.getTimestamp()).toBe(5000);
        });

    });

    describe("getIsLast", () => {

        it("returns false when isLast is false", () => {
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), makeData(), 1000, false, AudioCodec.pcm());
            expect(chunk.getIsLast()).toBe(false);
        });

        it("returns true when isLast is true", () => {
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), makeData(), 1000, true, AudioCodec.pcm());
            expect(chunk.getIsLast()).toBe(true);
        });

    });

    describe("getCodec", () => {

        it("returns the codec passed during creation", () => {
            const codec = AudioCodec.opus();
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), makeData(), 1000, false, codec);
            expect(chunk.getCodec().getValue()).toBe("opus");
        });

    });

    describe("getByteLength", () => {

        it("returns the byte length of the data buffer", () => {
            const data = makeData(4096);
            const chunk = AudioChunk.create(AudioChunkSequence.initial(), data, 1000, false, AudioCodec.pcm());
            expect(chunk.getByteLength()).toBe(4096);
        });

    });

});
