import { describe, it, expect, vi, beforeEach } from "vitest";
import { StreamManager } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("StreamManager", () => {
    let manager: StreamManager;

    beforeEach(() => {
        manager = new StreamManager();
    });

    describe("registerStream", () => {

        it("creates a new stream with active status", () => {
            manager.registerStream("stream-1");
            const stream = manager.getStream("stream-1");
            expect(stream).toBeDefined();
            expect(stream?.status).toBe("active");
            expect(stream?.chunks.length).toBe(0);
        });

    });

    describe("appendChunk", () => {

        it("adds a chunk to an existing stream", () => {
            manager.registerStream("stream-1");
            manager.appendChunk("stream-1", makeChunk(0));
            const stream = manager.getStream("stream-1");
            expect(stream?.chunks.length).toBe(1);
            expect(stream?.chunks[0].getSequence().getValue()).toBe(0);
        });

        it("does nothing for a non-existent stream", () => {
            expect(() => manager.appendChunk("non-existent", makeChunk(0))).not.toThrow();
        });

    });

    describe("completeStream", () => {

        it("marks the stream as completed", () => {
            manager.registerStream("stream-1");
            manager.completeStream("stream-1");
            const stream = manager.getStream("stream-1");
            expect(stream?.status).toBe("completed");
        });

        it("does nothing for a non-existent stream", () => {
            expect(() => manager.completeStream("non-existent")).not.toThrow();
        });

    });

    describe("cancelStream", () => {

        it("marks the stream as cancelled", () => {
            manager.registerStream("stream-1");
            manager.cancelStream("stream-1");
            const stream = manager.getStream("stream-1");
            expect(stream?.status).toBe("cancelled");
        });

        it("does nothing for a non-existent stream", () => {
            expect(() => manager.cancelStream("non-existent")).not.toThrow();
        });

    });

    describe("removeStream", () => {

        it("removes the stream from the manager", () => {
            manager.registerStream("stream-1");
            manager.removeStream("stream-1");
            expect(manager.getStream("stream-1")).toBeUndefined();
        });

    });

    describe("getStream", () => {

        it("returns undefined for a non-existent stream", () => {
            expect(manager.getStream("non-existent")).toBeUndefined();
        });

    });

});
