import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderInvocationQueue } from "../../../src/Infrastructure/Provider";
import { VoiceProviderId } from "../../../src/Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../../src/Domain/ValueObjects/ProviderCostMetadata";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("ProviderInvocationQueue", () => {
    let queue: ProviderInvocationQueue;

    beforeEach(() => {
        queue = new ProviderInvocationQueue();
    });

    describe("enqueue", () => {

        it("adds an item to the queue", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk()], cost);
            expect(queue.size()).toBe(1);
        });

        it("preserves insertion order", () => {
            const providerId1 = VoiceProviderId.create("provider-1");
            const providerId2 = VoiceProviderId.create("provider-2");
            const cost1 = ProviderCostMetadata.free("provider-1");
            const cost2 = ProviderCostMetadata.fromProvider("provider-2", 100);
            queue.enqueue(providerId1, [makeChunk(0)], cost1);
            queue.enqueue(providerId2, [makeChunk(1)], cost2);
            const first = queue.dequeue();
            expect(first?.providerId.getValue()).toBe("provider-1");
            expect(queue.size()).toBe(1);
        });

        it("increments size with multiple enqueues", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.enqueue(providerId, [makeChunk()], cost);
            expect(queue.size()).toBe(3);
        });

    });

    describe("dequeue", () => {

        it("returns the first enqueued item", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk(0)], cost);
            queue.enqueue(providerId, [makeChunk(1)], cost);
            const result = queue.dequeue();
            expect(result?.providerId.getValue()).toBe("provider-1");
            expect(result?.chunks.length).toBe(1);
            expect(result?.cost.getEstimatedCostMicros()).toBe(0);
        });

        it("returns undefined when queue is empty", () => {
            expect(queue.dequeue()).toBeUndefined();
        });

        it("removes the dequeued item from the queue", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.dequeue();
            expect(queue.size()).toBe(0);
        });

        it("returns items in FIFO order", () => {
            const providerId1 = VoiceProviderId.create("provider-a");
            const providerId2 = VoiceProviderId.create("provider-b");
            const providerId3 = VoiceProviderId.create("provider-c");
            const cost1 = ProviderCostMetadata.free("provider-a");
            const cost2 = ProviderCostMetadata.fromProvider("provider-b", 100);
            const cost3 = ProviderCostMetadata.fromProvider("provider-c", 200);
            queue.enqueue(providerId1, [makeChunk(0)], cost1);
            queue.enqueue(providerId2, [makeChunk(1)], cost2);
            queue.enqueue(providerId3, [makeChunk(2)], cost3);
            expect(queue.dequeue()?.providerId.getValue()).toBe("provider-a");
            expect(queue.dequeue()?.providerId.getValue()).toBe("provider-b");
            expect(queue.dequeue()?.providerId.getValue()).toBe("provider-c");
            expect(queue.size()).toBe(0);
        });

    });

    describe("size", () => {

        it("returns 0 for a new queue", () => {
            expect(queue.size()).toBe(0);
        });

        it("returns the correct size after enqueues and dequeues", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.enqueue(providerId, [makeChunk()], cost);
            expect(queue.size()).toBe(2);
            queue.dequeue();
            expect(queue.size()).toBe(1);
        });

    });

    describe("clear", () => {

        it("removes all items from the queue", () => {
            const providerId = VoiceProviderId.create("provider-1");
            const cost = ProviderCostMetadata.free("provider-1");
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.enqueue(providerId, [makeChunk()], cost);
            queue.clear();
            expect(queue.size()).toBe(0);
            expect(queue.dequeue()).toBeUndefined();
        });

    });

});
