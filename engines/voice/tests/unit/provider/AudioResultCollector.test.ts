import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioResultCollector } from "../../../src/Infrastructure/Provider";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("AudioResultCollector", () => {
    let collector: AudioResultCollector;

    beforeEach(() => {
        collector = new AudioResultCollector();
    });

    describe("recordResult", () => {

        it("stores a successful result", () => {
            collector.recordResult("req-1", true, [makeChunk(0), makeChunk(1)]);
            const result = collector.getResult("req-1");
            expect(result).toBeDefined();
            expect(result?.success).toBe(true);
            expect(result?.chunks.length).toBe(2);
        });

        it("stores a failed result with an error message", () => {
            collector.recordResult("req-2", false, [], "timeout");
            const result = collector.getResult("req-2");
            expect(result).toBeDefined();
            expect(result?.success).toBe(false);
            expect(result?.error).toBe("timeout");
        });

        it("overwrites previous result for the same requestId", () => {
            collector.recordResult("req-1", true, [makeChunk(0)]);
            collector.recordResult("req-1", false, [], "error");
            const result = collector.getResult("req-1");
            expect(result?.success).toBe(false);
            expect(result?.error).toBe("error");
        });

    });

    describe("getResult", () => {

        it("returns undefined for an unknown requestId", () => {
            expect(collector.getResult("unknown")).toBeUndefined();
        });

        it("returns the stored result for a known requestId", () => {
            collector.recordResult("req-1", true, [makeChunk(0)]);
            const result = collector.getResult("req-1");
            expect(result).toBeDefined();
            expect(result?.chunks[0].getSequence().getValue()).toBe(0);
        });

    });

    describe("clear", () => {

        it("removes all stored results", () => {
            collector.recordResult("req-1", true, [makeChunk(0)]);
            collector.recordResult("req-2", false, [], "error");
            collector.clear();
            expect(collector.getResult("req-1")).toBeUndefined();
            expect(collector.getResult("req-2")).toBeUndefined();
            expect(collector.getResult("req-3")).toBeUndefined();
        });

    });

});
