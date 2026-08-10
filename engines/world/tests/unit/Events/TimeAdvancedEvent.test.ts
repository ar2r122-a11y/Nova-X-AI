import { describe, it, expect } from "vitest";
import { TimeAdvancedEvent } from "../../../src/Domain/Events/TimeAdvancedEvent";

describe("TimeAdvancedEvent", () => {
    it("test_creation_sets_properties_correctly", () => {
        const event = new TimeAdvancedEvent("world-1", 3600, 7200, "2025-01-01", "2025-01-02", "winter", "winter", 1000, "corr-1");
        expect(event.eventType).toBe("EVT_WORLD_TimeAdvanced");
        expect(event.worldId).toBe("world-1");
        expect(event.previousTime).toBe(3600);
        expect(event.newTime).toBe(7200);
        expect(event.previousDate).toBe("2025-01-01");
        expect(event.newDate).toBe("2025-01-02");
    });
});

