import { describe, it, expect } from "vitest";
import { VoiceRecoveryStartedEvent } from "../../../src/Domain/Events/index";

describe("VoiceRecoveryStartedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceRecoveryStartedEvent("voice-1", "network dropout", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_RecoveryStarted");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceRecoveryStartedEvent("voice-1", "network dropout", "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.reason).toBe("network dropout");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceRecoveryStartedEvent("voice-1", "reason", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
