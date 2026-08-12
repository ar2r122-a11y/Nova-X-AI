import { describe, it, expect } from "vitest";
import { VoiceSessionCreatedEvent } from "../../../src/Domain/Events/index";

describe("VoiceSessionCreatedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceSessionCreatedEvent("session-1", "voice-1", "profile-1", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_SessionCreated");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceSessionCreatedEvent("session-1", "voice-1", "profile-1", "corr-1");
        expect(event.sessionId).toBe("session-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.profileId).toBe("profile-1");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceSessionCreatedEvent("session-1", "voice-1", "profile-1", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
