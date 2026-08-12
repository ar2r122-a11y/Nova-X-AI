import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioChunkAssembler } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence: number, isLast = false): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), isLast, AudioCodec.pcm());
};

describe("AudioChunkAssembler", () => {
    let assembler: AudioChunkAssembler;

    beforeEach(() => {
        assembler = new AudioChunkAssembler();
    });

    describe("assemble", () => {

        it("assembles in-order chunks and returns the last chunk", () => {
            const chunk0 = assembler.assemble(makeChunk(0, false));
            expect(chunk0).toBeNull();
            const chunk1 = assembler.assemble(makeChunk(1, false));
            expect(chunk1).toBeNull();
            const chunk2 = assembler.assemble(makeChunk(2, true));
            expect(chunk2).not.toBeNull();
            expect(chunk2?.getSequence().getValue()).toBe(2);
            expect(chunk2?.getIsLast()).toBe(true);
        });

        it("returns null for out-of-order chunks", () => {
            assembler.assemble(makeChunk(0, false));
            const outOfOrder = assembler.assemble(makeChunk(2, false));
            expect(outOfOrder).toBeNull();
        });

        it("buffers out-of-order chunks and assembles when missing chunk arrives", () => {
            assembler.assemble(makeChunk(0, false));
            assembler.assemble(makeChunk(2, false));
            const chunk1 = assembler.assemble(makeChunk(1, false));
            expect(chunk1).toBeNull();
            const chunk2 = assembler.assemble(makeChunk(3, true));
            expect(chunk2).not.toBeNull();
            expect(chunk2?.getSequence().getValue()).toBe(3);
        });

        it("ignores duplicate chunks", () => {
            assembler.assemble(makeChunk(0, false));
            assembler.assemble(makeChunk(0, false));
            const chunk1 = assembler.assemble(makeChunk(1, true));
            expect(chunk1).not.toBeNull();
            expect(chunk1?.getSequence().getValue()).toBe(1);
        });

        it("returns the first chunk after reset if it is the last chunk", () => {
            assembler.reset();
            const result = assembler.assemble(makeChunk(0, true));
            expect(result).not.toBeNull();
            expect(result?.getSequence().getValue()).toBe(0);
        });

    });

    describe("reset", () => {

        it("clears buffered chunks and resets sequence", () => {
            assembler.assemble(makeChunk(0, false));
            assembler.assemble(makeChunk(2, false));
            assembler.reset();
            const result = assembler.assemble(makeChunk(0, true));
            expect(result).not.toBeNull();
            expect(result?.getSequence().getValue()).toBe(0);
            expect(result?.getIsLast()).toBe(true);
        });

    });

});
