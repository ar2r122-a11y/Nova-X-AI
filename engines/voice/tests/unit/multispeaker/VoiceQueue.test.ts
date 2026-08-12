import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceQueue } from "../../../src/Infrastructure/MultiSpeaker";
import type { StreamHandle } from "../../../src/Contracts/IAudioStreamingWorker";

const makeMockStream = (streamId: string): StreamHandle => ({
    streamId,
    audioChunkIterator: (async function* () {})()
} as any as StreamHandle);

describe("VoiceQueue", () => {
    let queue: VoiceQueue;

    beforeEach(() => {
        queue = new VoiceQueue();
    });

    describe("enqueue", () => {

        it("adds a stream to the queue", () => {
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            expect(queue.size()).toBe(1);
        });

    });

    describe("dequeue", () => {

        it("returns the highest priority stream", () => {
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            queue.enqueue(makeMockStream("stream-2") as any, 5);
            const dequeued = queue.dequeue();
            expect(dequeued).toBeDefined();
            expect((dequeued?.stream as any).streamId).toBe("stream-2");
        });

        it("returns undefined when queue is empty", () => {
            expect(queue.dequeue()).toBeUndefined();
        });

        it("returns streams in priority order", () => {
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            queue.enqueue(makeMockStream("stream-2") as any, 3);
            queue.enqueue(makeMockStream("stream-3") as any, 2);

            expect((queue.dequeue()?.stream as any).streamId).toBe("stream-2");
            expect((queue.dequeue()?.stream as any).streamId).toBe("stream-3");
            expect((queue.dequeue()?.stream as any).streamId).toBe("stream-1");
        });

    });

    describe("size", () => {

        it("returns the number of streams in the queue", () => {
            expect(queue.size()).toBe(0);
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            expect(queue.size()).toBe(1);
            queue.enqueue(makeMockStream("stream-2") as any, 2);
            expect(queue.size()).toBe(2);
        });

    });

    describe("clear", () => {

        it("removes all streams from the queue", () => {
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            queue.enqueue(makeMockStream("stream-2") as any, 2);
            queue.clear();
            expect(queue.size()).toBe(0);
            expect(queue.dequeue()).toBeUndefined();
        });

    });

});
