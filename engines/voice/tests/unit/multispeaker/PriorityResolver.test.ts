import { describe, it, expect, vi, beforeEach } from "vitest";
import { PriorityResolver } from "../../../src/Infrastructure/MultiSpeaker";
import { VoiceQueue } from "../../../src/Infrastructure/MultiSpeaker";
import type { StreamHandle } from "../../../src/Contracts/IAudioStreamingWorker";

const makeMockStream = (streamId: string): StreamHandle => ({
    streamId,
    audioChunkIterator: (async function* () {})()
} as any as StreamHandle);

describe("PriorityResolver", () => {
    let resolver: PriorityResolver;

    beforeEach(() => {
        resolver = new PriorityResolver();
    });

    describe("resolve", () => {

        it("dequeues the highest priority item", () => {
            const queue = new VoiceQueue();
            queue.enqueue(makeMockStream("stream-1") as any, 1);
            queue.enqueue(makeMockStream("stream-2") as any, 5);

            const result = resolver.resolve(queue);
            expect(result).toBeDefined();
            expect((result?.stream as any).streamId).toBe("stream-2");
        });

        it("returns undefined for empty queue", () => {
            const queue = new VoiceQueue();
            const result = resolver.resolve(queue);
            expect(result).toBeUndefined();
        });

        it("returns single item from queue", () => {
            const queue = new VoiceQueue();
            queue.enqueue(makeMockStream("stream-1") as any, 10);
            const result = resolver.resolve(queue);
            expect(result).toBeDefined();
            expect((result?.stream as any).streamId).toBe("stream-1");
            expect(queue.size()).toBe(0);
        });

    });

});
