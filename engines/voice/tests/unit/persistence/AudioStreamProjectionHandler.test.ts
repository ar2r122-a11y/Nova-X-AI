import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioStreamProjectionHandler } from "../../../src/Infrastructure/Projections/AudioStreamProjectionHandler";

describe("AudioStreamProjectionHandler", () => {
    let handler: AudioStreamProjectionHandler;

    beforeEach(() => {
        handler = new AudioStreamProjectionHandler();
    });

    it("is instantiable", () => {
        expect(handler).toBeInstanceOf(AudioStreamProjectionHandler);
    });

    describe("handle", () => {
        it("handles AudioChunkEvent without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_AudioChunk",
                voiceId: "voice-1",
                sequence: 1,
                chunkSizeBytes: 1024,
                codec: "pcm",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });

        it("ignores unrelated events without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_VoiceInitialized",
                voiceId: "voice-1",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });
    });
});
