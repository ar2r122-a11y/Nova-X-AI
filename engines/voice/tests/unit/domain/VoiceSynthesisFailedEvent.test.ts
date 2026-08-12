import { describe, it, expect } from "vitest";
import { VoiceSynthesisFailedEvent } from "../../../src/Domain/Events/index";

describe("VoiceSynthesisFailedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceSynthesisFailedEvent("voice-1", "req-1", "provider error", "provider-1", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_SynthesisFailed");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceSynthesisFailedEvent("voice-1", "req-1", "provider error", "provider-1", "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.reason).toBe("provider error");
        expect(event.providerId).toBe("provider-1");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceSynthesisFailedEvent("voice-1", "req-1", "error", "provider-1", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
