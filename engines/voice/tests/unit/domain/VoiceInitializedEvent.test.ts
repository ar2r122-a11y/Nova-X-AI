import { describe, it, expect } from "vitest";
import { VoiceInitializedEvent } from "../../../src/Domain/Events/index";

describe("VoiceInitializedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceInitializedEvent("voice-1", Date.now(), "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceInitialized");
    });

    it("stores voiceId", () => {
        const event = new VoiceInitializedEvent("voice-1", Date.now(), "corr-1");
        expect(event.voiceId).toBe("voice-1");
    });

    it("stores timestamp", () => {
        const ts = 1000;
        const event = new VoiceInitializedEvent("voice-1", ts, "corr-1");
        expect(event.timestamp).toBe(ts);
    });

    it("stores correlationId", () => {
        const event = new VoiceInitializedEvent("voice-1", Date.now(), "corr-1");
        expect(event.correlationId).toBe("corr-1");
    });

});
