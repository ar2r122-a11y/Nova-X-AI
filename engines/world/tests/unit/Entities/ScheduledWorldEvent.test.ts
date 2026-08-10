import { describe, it, expect } from "vitest";
import { ScheduledWorldEvent } from "../../../src/Domain/Entities/ScheduledWorldEvent";

describe("ScheduledWorldEvent", () => {
    it("test_creation_succeeds_with_valid_data", () => {
        const event = ScheduledWorldEvent.create("event-1", "weather_change", 5000, { regionId: "r1" });
        expect(event.getEventId()).toBe("event-1");
        expect(event.getEventType()).toBe("weather_change");
        expect(event.getTriggerTime()).toBe(5000);
        expect(event.isExecuted()).toBe(false);
    });

    it("test_creation_throws_with_empty_event_id", () => {
        expect(() => ScheduledWorldEvent.create("", "type", 5000, {})).toThrow();
    });

    it("test_creation_throws_with_negative_trigger_time", () => {
        expect(() => ScheduledWorldEvent.create("e1", "type", -1, {})).toThrow();
    });

    it("test_mark_executed_changes_state", () => {
        const event = ScheduledWorldEvent.create("event-1", "type", 5000, {});
        event.markExecuted();
        expect(event.isExecuted()).toBe(true);
    });
});

