import { describe, it, expect } from "vitest";
import { WorldEventStoreAggregate } from "../../../src/Domain/Aggregates/WorldEventStoreAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";

describe("WorldEventStoreAggregate", () => {
    it("test_create_initializes_empty_store", () => {
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        expect(aggregate.getVersion().getValue()).toBe(0);
    });

    it("test_append_event_increments_version_and_stores_event", () => {
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        const entry = aggregate.appendEvent("TestEvent", { foo: "bar" }, "corr-1");
        expect(entry.getVersion().getValue()).toBe(1);
        expect(entry.getEventType()).toBe("TestEvent");
        expect(aggregate.getEventsFromVersion(WorldEventVersion.initial())).toHaveLength(1);
    });

    it("test_schedule_event_adds_event", () => {
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        const scheduled = aggregate.scheduleEvent("evt-1", "weather", 5000, { regionId: "r1" });
        expect(scheduled.getEventId()).toBe("evt-1");
        expect(aggregate.getDueScheduledEvents(6000)).toHaveLength(1);
        expect(aggregate.getDueScheduledEvents(4000)).toHaveLength(0);
    });

    it("test_mark_scheduled_event_executed_marks_as_done", () => {
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        aggregate.scheduleEvent("evt-1", "weather", 5000, {});
        aggregate.markScheduledEventExecuted("evt-1");
        expect(aggregate.getDueScheduledEvents(6000)).toHaveLength(0);
    });

    it("test_get_events_from_version_filters_correctly", () => {
        const aggregate = WorldEventStoreAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        aggregate.appendEvent("E1", {}, "c1");
        aggregate.commitEvents();
        aggregate.appendEvent("E2", {}, "c2");
        const fromV1 = aggregate.getEventsFromVersion(WorldEventVersion.create(1));
        expect(fromV1).toHaveLength(2);
        expect(fromV1[0].getEventType()).toBe("E1");
        expect(fromV1[1].getEventType()).toBe("E2");
    });
});

