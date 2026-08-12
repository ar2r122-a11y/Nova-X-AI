import { describe, it, expect, vi, beforeEach } from "vitest";
import { StreamRecoveryManager } from "../../../src/Infrastructure/Streaming";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

const makeChunk = (sequence = 0): AudioChunk => {
    const data = new ArrayBuffer(1024);
    return AudioChunk.create(AudioChunkSequence.create(sequence), data, Date.now(), false, AudioCodec.pcm());
};

describe("StreamRecoveryManager", () => {
    let manager: StreamRecoveryManager;

    beforeEach(() => {
        manager = new StreamRecoveryManager();
    });

    describe("recover", () => {

        it("returns an empty array on first recovery", async () => {
            const result = await manager.recover("stream-1");
            expect(result).toEqual([]);
        });

        it("increments the recovery count", async () => {
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            expect(manager.canRecover("stream-1")).toBe(true);
        });

        it("tracks recovery counts per streamId", async () => {
            await manager.recover("stream-a");
            await manager.recover("stream-b");
            await manager.recover("stream-a");
            expect(manager.canRecover("stream-a")).toBe(true);
            expect(manager.canRecover("stream-b")).toBe(true);
        });

    });

    describe("canRecover", () => {

        it("returns true when retry count is below 3", async () => {
            await manager.recover("stream-1");
            expect(manager.canRecover("stream-1")).toBe(true);
        });

        it("returns true when retry count is exactly 2", async () => {
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            expect(manager.canRecover("stream-1")).toBe(true);
        });

        it("returns false when retry count reaches 3", async () => {
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            expect(manager.canRecover("stream-1")).toBe(false);
        });

        it("returns true for a new streamId", () => {
            expect(manager.canRecover("new-stream")).toBe(true);
        });

    });

    describe("clear", () => {

        it("removes recovery history for a streamId", async () => {
            await manager.recover("stream-1");
            manager.clear("stream-1");
            expect(manager.canRecover("stream-1")).toBe(true);
        });

        it("allows recovery after clear even after max retries", async () => {
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            await manager.recover("stream-1");
            expect(manager.canRecover("stream-1")).toBe(false);
            manager.clear("stream-1");
            expect(manager.canRecover("stream-1")).toBe(true);
        });

    });

});
