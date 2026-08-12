import { describe, it, expect } from "vitest";
import { VoiceProfileCreatedEvent } from "../../../src/Domain/Events/index";

describe("VoiceProfileCreatedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceProfileCreatedEvent("profile-1", "char-1", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceProfileCreated");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceProfileCreatedEvent("profile-1", "char-1", "corr-1");
        expect(event.profileId).toBe("profile-1");
        expect(event.characterId).toBe("char-1");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceProfileCreatedEvent("profile-1", "char-1", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
