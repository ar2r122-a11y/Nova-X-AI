import { describe, it, expect } from "vitest";
import { VoiceProviderStatusChangedEvent } from "../../../src/Domain/Events/index";

describe("VoiceProviderStatusChangedEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceProviderStatusChangedEvent("provider-1", "healthy", "degraded", "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_ProviderStatusChanged");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceProviderStatusChangedEvent("provider-1", "healthy", "degraded", "corr-1");
        expect(event.providerId).toBe("provider-1");
        expect(event.previousStatus).toBe("healthy");
        expect(event.newStatus).toBe("degraded");
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceProviderStatusChangedEvent("provider-1", "healthy", "degraded", "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
