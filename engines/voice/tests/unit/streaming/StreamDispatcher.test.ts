import { describe, it, expect, vi, beforeEach } from "vitest";
import { StreamDispatcher } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("StreamDispatcher", () => {
    let dispatcher: StreamDispatcher;

    beforeEach(() => {
        dispatcher = new StreamDispatcher();
    });

    describe("registerListener", () => {

        it("registers a listener for a streamId", () => {
            const listener = vi.fn();
            dispatcher.registerListener("0", listener);
            dispatcher.dispatch(makeChunk(0));
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it("overwrites an existing listener for the same streamId", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            dispatcher.registerListener("0", listener1);
            dispatcher.registerListener("0", listener2);
            dispatcher.dispatch(makeChunk(0));
            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).toHaveBeenCalledTimes(1);
        });

    });

    describe("unregisterListener", () => {

        it("removes the listener for a streamId", () => {
            const listener = vi.fn();
            dispatcher.registerListener("0", listener);
            dispatcher.unregisterListener("0");
            dispatcher.dispatch(makeChunk(0));
            expect(listener).not.toHaveBeenCalled();
        });

        it("does nothing when unregistering a non-existent streamId", () => {
            expect(() => dispatcher.unregisterListener("non-existent")).not.toThrow();
        });

    });

    describe("dispatch", () => {

        it("calls the listener with the chunk", () => {
            const listener = vi.fn();
            dispatcher.registerListener("0", listener);
            const chunk = makeChunk(0);
            dispatcher.dispatch(chunk);
            expect(listener).toHaveBeenCalledWith(chunk);
        });

        it("does nothing when no listener is registered for the streamId", () => {
            expect(() => dispatcher.dispatch(makeChunk(0))).not.toThrow();
        });

    });

    describe("clear", () => {

        it("removes all listeners", () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            dispatcher.registerListener("0", listener1);
            dispatcher.registerListener("1", listener2);
            dispatcher.clear();
            dispatcher.dispatch(makeChunk(0));
            dispatcher.dispatch(makeChunk(1));
            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).not.toHaveBeenCalled();
        });

    });

});
