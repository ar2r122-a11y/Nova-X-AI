import { describe, it, expect } from "vitest";
import { AudioStreamEntity } from "../../../src/Domain/Entities/AudioStreamEntity";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

describe("AudioStreamEntity", () => {

    const makeChunk = (size = 1024): AudioChunk => {
        const data = new ArrayBuffer(size);
        return AudioChunk.create(AudioChunkSequence.initial(), data, Date.now(), false, AudioCodec.pcm());
    };

    describe("create", () => {

        it("creates an active stream with default values", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            expect(stream.getStreamId()).toBe("stream-1");
            expect(stream.getVoiceId()).toBe("voice-1");
            expect(stream.getRequestId()).toBe("req-1");
            expect(stream.getProfileId()).toBe("profile-1");
            expect(stream.getProviderId()).toBe("provider-1");
            expect(stream.getText()).toBe("Hello");
            expect(stream.getStatus()).toBe("active");
            expect(stream.getChunks()).toHaveLength(0);
            expect(stream.getTotalBytes()).toBe(0);
            expect(stream.getCompletedAt()).toBeNull();
        });

    });

    describe("addChunk", () => {

        it("appends a chunk and updates total bytes", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            const chunk = makeChunk(500);
            stream.appendChunk(chunk);
            expect(stream.getChunks()).toHaveLength(1);
            expect(stream.getTotalBytes()).toBe(500);
        });

        it("appends multiple chunks and accumulates bytes", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            stream.appendChunk(makeChunk(100));
            stream.appendChunk(makeChunk(200));
            expect(stream.getChunks()).toHaveLength(2);
            expect(stream.getTotalBytes()).toBe(300);
        });

    });

    describe("getters", () => {

        it("returns the created at timestamp", () => {
            const before = Date.now();
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            const after = Date.now();
            expect(stream.getCreatedAt()).toBeGreaterThanOrEqual(before);
            expect(stream.getCreatedAt()).toBeLessThanOrEqual(after);
        });

        it("returns null completedAt before completion", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            expect(stream.getCompletedAt()).toBeNull();
        });

        it("returns a timestamp after completion", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            const before = Date.now();
            stream.complete();
            const after = Date.now();
            expect(stream.getCompletedAt()).toBeGreaterThanOrEqual(before);
            expect(stream.getCompletedAt()).toBeLessThanOrEqual(after);
            expect(stream.getStatus()).toBe("completed");
        });

        it("returns cancelled status after cancel", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            stream.cancel();
            expect(stream.getStatus()).toBe("cancelled");
        });

        it("returns failed status with reason after fail", () => {
            const stream = AudioStreamEntity.create("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello");
            stream.fail("network error");
            expect(stream.getStatus()).toBe("failed: network error");
        });

    });

});
