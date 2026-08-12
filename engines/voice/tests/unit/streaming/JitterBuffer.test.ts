import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JitterBuffer } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("JitterBuffer", () => {
    let jitterBuffer: JitterBuffer;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        jitterBuffer = new JitterBuffer(50);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("push", () => {

        it("adds a chunk to the buffer", () => {
            jitterBuffer.push(makeChunk(0));
            expect(jitterBuffer.size()).toBe(1);
        });

        it("adds multiple chunks", () => {
            jitterBuffer.push(makeChunk(0));
            jitterBuffer.push(makeChunk(1));
            expect(jitterBuffer.size()).toBe(2);
        });

    });

    describe("pop", () => {

        it("returns null when buffer is empty", () => {
            expect(jitterBuffer.pop()).toBeNull();
        });

        it("returns null before maxDelayMs has elapsed", () => {
            jitterBuffer.push(makeChunk(0));
            expect(jitterBuffer.pop()).toBeNull();
        });

        it("returns the first chunk after maxDelayMs", () => {
            jitterBuffer.push(makeChunk(0));
            jitterBuffer.push(makeChunk(1));
            vi.advanceTimersByTime(50);
            const result = jitterBuffer.pop();
            expect(result).not.toBeNull();
            expect(result?.getSequence().getValue()).toBe(0);
        });

        it("removes the popped chunk from the buffer", () => {
            jitterBuffer.push(makeChunk(0));
            vi.advanceTimersByTime(50);
            jitterBuffer.pop();
            expect(jitterBuffer.size()).toBe(0);
        });

        it("handles out-of-order chunks by returning the lowest sequence first", () => {
            jitterBuffer.push(makeChunk(2));
            jitterBuffer.push(makeChunk(0));
            jitterBuffer.push(makeChunk(1));
            vi.advanceTimersByTime(50);
            const result = jitterBuffer.pop();
            expect(result?.getSequence().getValue()).toBe(0);
        });

    });

    describe("clear", () => {

        it("removes all chunks", () => {
            jitterBuffer.push(makeChunk(0));
            jitterBuffer.push(makeChunk(1));
            jitterBuffer.clear();
            expect(jitterBuffer.size()).toBe(0);
        });

    });

    describe("size", () => {

        it("returns 0 for an empty buffer", () => {
            expect(jitterBuffer.size()).toBe(0);
        });

    });

});
