import { describe, it, expect } from "vitest";
import { VoiceSynthesisStartedEvent } from "../../../src/Domain/Events/index";

describe("VoiceSynthesisStartedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceSynthesisStartedEvent("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_SynthesisStarted");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceSynthesisStartedEvent("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.text).toBe("Hello");
        expect(event.profileId).toBe("profile-1");
        expect(event.providerId).toBe("provider-1");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceSynthesisStartedEvent("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
