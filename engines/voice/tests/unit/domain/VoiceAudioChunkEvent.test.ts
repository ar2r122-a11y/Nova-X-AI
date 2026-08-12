import { describe, it, expect } from "vitest";
import { VoiceAudioChunkEvent } from "../../../src/Domain/Events/index";

describe("VoiceAudioChunkEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceAudioChunkEvent("voice-1", "req-1", 5, 1024, "pcm", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_AudioChunk");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceAudioChunkEvent("voice-1", "req-1", 5, 1024, "pcm", "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.sequence).toBe(5);
        expect(event.chunkSizeBytes).toBe(1024);
        expect(event.codec).toBe("pcm");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceAudioChunkEvent("voice-1", "req-1", 5, 1024, "pcm", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
