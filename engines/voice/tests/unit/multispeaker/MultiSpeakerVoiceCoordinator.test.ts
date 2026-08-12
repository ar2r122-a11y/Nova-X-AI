import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultiSpeakerVoiceCoordinator } from "../../../src/Infrastructure/MultiSpeaker";
import { SpeakerVoiceMapping } from "../../../src/Infrastructure/MultiSpeaker";
import { VoiceQueue } from "../../../src/Infrastructure/MultiSpeaker";
import type { StreamHandle } from "../../../src/Contracts/IAudioStreamingWorker";

describe("MultiSpeakerVoiceCoordinator", () => {
    let coordinator: MultiSpeakerVoiceCoordinator;
    let mockStream: Partial<StreamHandle>;

    beforeEach(() => {
        coordinator = new MultiSpeakerVoiceCoordinator();
        mockStream = {
            streamId: "stream-1",
            audioChunkIterator: (async function* () {})()
        };
    });

    describe("resolveVoiceProfile", () => {

        it("returns null when no mapping exists", async () => {
            const result = await coordinator.resolveVoiceProfile("character-1");
            expect(result).toBeNull();
        });

        it("returns mapped voice profile id", async () => {
            coordinator.mapVoice("character-1", "profile-1");
            const result = await coordinator.resolveVoiceProfile("character-1");
            expect(result).toBe("profile-1");
        });

    });

    describe("queueAudio", () => {

        it("queues audio stream with priority", async () => {
            await coordinator.queueAudio(mockStream as StreamHandle, 10);
            expect((coordinator as any).voiceQueue.size()).toBe(1);
        });

        it("queues multiple streams with different priorities", async () => {
            await coordinator.queueAudio({ ...mockStream, streamId: "stream-1" } as StreamHandle, 10);
            await coordinator.queueAudio({ ...mockStream, streamId: "stream-2" } as StreamHandle, 20);
            expect((coordinator as any).voiceQueue.size()).toBe(2);
        });

    });

    describe("mix", () => {

        it("returns null when no streams are queued", async () => {
            const result = await coordinator.mix();
            expect(result).toBeNull();
        });

    });

    describe("mapVoice", () => {

        it("maps character id to voice profile id", () => {
            coordinator.mapVoice("character-1", "profile-1");
            expect((coordinator as any).voiceMapping.get("character-1")).toBe("profile-1");
        });

        it("overwrites existing mapping", () => {
            coordinator.mapVoice("character-1", "profile-1");
            coordinator.mapVoice("character-1", "profile-2");
            expect((coordinator as any).voiceMapping.get("character-1")).toBe("profile-2");
        });

    });

});
