import { describe, it, expect, beforeEach, vi } from "vitest";
import { AudioStreamingWorker } from "../../src/Infrastructure/Workers/AudioStreamingWorker";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";

describe("Throughput", () => {
    it("processes streaming chunks without blocking main thread", async () => {
        const worker = new AudioStreamingWorker();
        const mockEngine: any = {
            synthesizeSpeech: vi.fn().mockResolvedValue({
                streamId: "stream-1",
                requestId: "req-1",
                voiceId: "voice-1",
                providerId: "provider-1",
                profileId: "profile-1",
                status: "streaming",
                estimatedDurationMs: 1000,
                correlationId: "corr-1"
            })
        };

        worker.setEngine(mockEngine);
        worker.setVoiceId(VoiceId.create("voice-1"));
        await worker.start();

        const start = performance.now();
        const handle = await worker.enqueueStream({
            streamId: "stream-1",
            text: "Hello world",
            voiceProfileId: "profile-1",
            providerId: "provider-1",
            correlationId: "corr-1",
            causationId: "causation-1"
        });

        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(200);
        expect(handle.streamId).toBe("stream-1");

        await worker.stop();
    });
});
