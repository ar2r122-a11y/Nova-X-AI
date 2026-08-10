import { describe, it, expect } from "vitest";
import { GlobalVariableUpdatedEvent } from "../../../src/Domain/Events/GlobalVariableUpdatedEvent";

describe("GlobalVariableUpdatedEvent", () => {
    it("test_creation_sets_properties_correctly", () => {
        const event = new GlobalVariableUpdatedEvent("world-1", "dayCount", 0, 1, 1000, "corr-1");
        expect(event.eventType).toBe("EVT_WORLD_GlobalVariableUpdated");
        expect(event.key).toBe("dayCount");
        expect(event.previousValue).toBe(0);
        expect(event.newValue).toBe(1);
    });
});

