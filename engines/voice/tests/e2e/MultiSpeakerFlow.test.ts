import { describe, it, expect, beforeEach, vi } from "vitest";
import { MultiSpeakerVoiceCoordinator } from "../../src/Infrastructure/MultiSpeaker";
import { AudioStreamHandleDto } from "../../src/Application/DTO/AudioStreamHandleDto";

describe("MultiSpeakerFlow", () => {
    it("maps character to voice profile and queues audio", async () => {
        const coordinator = new MultiSpeakerVoiceCoordinator();
        coordinator.mapVoice("char-1", "profile-1");
        expect(await coordinator.resolveVoiceProfile("char-1")).toBe("profile-1");

        const mockStream: any = { streamId: "stream-1" };
        await coordinator.queueAudio(mockStream, 10);
    });

    it("returns null mix when no streams queued", async () => {
        const coordinator = new MultiSpeakerVoiceCoordinator();
        const result = await coordinator.mix();
        expect(result).toBeNull();
    });
});
