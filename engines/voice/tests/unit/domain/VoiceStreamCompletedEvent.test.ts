import { describe, it, expect } from "vitest";
import { VoiceStreamCompletedEvent } from "../../../src/Domain/Events/index";

describe("VoiceStreamCompletedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceStreamCompletedEvent("voice-1", "req-1", 5000, 10, "provider-1", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_StreamCompleted");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceStreamCompletedEvent("voice-1", "req-1", 5000, 10, "provider-1", "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.durationMs).toBe(5000);
        expect(event.totalChunks).toBe(10);
        expect(event.providerId).toBe("provider-1");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceStreamCompletedEvent("voice-1", "req-1", 5000, 10, "provider-1", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
