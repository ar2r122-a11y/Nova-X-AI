import { describe, it, expect } from "vitest";
import { VoiceSessionFailedEvent } from "../../../src/Domain/Events/index";

describe("VoiceSessionFailedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceSessionFailedEvent("session-1", "voice-1", "timeout", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_SessionFailed");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceSessionFailedEvent("session-1", "voice-1", "timeout", "corr-1");
        expect(event.sessionId).toBe("session-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.reason).toBe("timeout");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceSessionFailedEvent("session-1", "voice-1", "timeout", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
