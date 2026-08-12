import { describe, it, expect } from "vitest";
import { VoiceBudgetExceededEvent } from "../../../src/Domain/Events/index";

describe("VoiceBudgetExceededEvent", () => {

    it("has the correct event type", () => {
        const event = new VoiceBudgetExceededEvent("voice-1", "daily", 1000, 1000, "corr-1");
        expect(event.eventType).toBe("EVT_VOICE_BudgetExceeded");
    });

    it("stores all constructor arguments", () => {
        const event = new VoiceBudgetExceededEvent("voice-1", "daily", 1000, 1000, "corr-1");
        expect(event.voiceId).toBe("voice-1");
        expect(event.budgetType).toBe("daily");
        expect(event.currentValue).toBe(1000);
        expect(event.limitValue).toBe(1000);
        expect(event.correlationId).toBe("corr-1");
    });

    it("sets timestamp to Date.now()", () => {
        const before = Date.now();
        const event = new VoiceBudgetExceededEvent("voice-1", "daily", 1000, 1000, "corr-1");
        const after = Date.now();
        expect(event.timestamp).toBeGreaterThanOrEqual(before);
        expect(event.timestamp).toBeLessThanOrEqual(after);
    });

});
