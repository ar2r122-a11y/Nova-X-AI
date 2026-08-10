import { describe, it, expect } from "vitest";
import { WorldInitializedEvent } from "../../../src/Domain/Events/WorldInitializedEvent";

describe("WorldInitializedEvent", () => {
    it("test_creation_sets_properties_correctly", () => {
        const event = new WorldInitializedEvent("world-1", "Test World", 1000, "corr-1");
        expect(event.eventType).toBe("EVT_WORLD_WorldInitialized");
        expect(event.worldId).toBe("world-1");
        expect(event.worldName).toBe("Test World");
        expect(event.timestamp).toBe(1000);
        expect(event.correlationId).toBe("corr-1");
    });
});

