import { describe, it, expect } from "vitest";
import { VoiceProfileUpdatedEvent } from "../../../src/Domain/Events/index";

describe("VoiceProfileUpdatedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceProfileUpdatedEvent("profile-1", ["speakingRate", "pitchModifier"], "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceProfileUpdated");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceProfileUpdatedEvent("profile-1", ["speakingRate"], "corr-1");
        expect(event.profileId).toBe("profile-1");
        expect(event.updatedFields).toEqual(["speakingRate"]);
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceProfileUpdatedEvent("profile-1", [], "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
