import { describe, it, expect } from "vitest";
import { NpcPresenceUpdatedEvent } from "../../../src/Domain/Events/NpcPresenceUpdatedEvent";

describe("NpcPresenceUpdatedEvent", () => {
    it("test_creation_sets_properties_correctly", () => {
        const event = new NpcPresenceUpdatedEvent("world-1", "char-1", "loc-1", "loc-0", "arrived", 1000, "corr-1");
        expect(event.eventType).toBe("EVT_WORLD_NpcPresenceUpdated");
        expect(event.characterId).toBe("char-1");
        expect(event.locationId).toBe("loc-1");
        expect(event.action).toBe("arrived");
    });
});

