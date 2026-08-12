import { describe, it, expect } from "vitest";
import { VoiceStreamInterruptedEvent } from "../../../src/Domain/Events/index";

describe("VoiceStreamInterruptedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceStreamInterruptedEvent("voice-1", "req-1", "timeout", 3, "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_StreamInterrupted");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceStreamInterruptedEvent("voice-1", "req-1", "timeout", 3, "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.reason).toBe("timeout");
        expect(event.sequenceIndex).toBe(3);
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceStreamInterruptedEvent("voice-1", "req-1", "timeout", 3, "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
