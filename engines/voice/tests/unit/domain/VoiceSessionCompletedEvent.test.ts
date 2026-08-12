import { describe, it, expect } from "vitest";
import { VoiceSessionCompletedEvent } from "../../../src/Domain/Events/index";

describe("VoiceSessionCompletedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceSessionCompletedEvent("session-1", "voice-1", 3000, "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_SessionCompleted");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceSessionCompletedEvent("session-1", "voice-1", 3000, "corr-1");
        expect(event.sessionId).toBe("session-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.durationMs).toBe(3000);
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceSessionCompletedEvent("session-1", "voice-1", 3000, "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
