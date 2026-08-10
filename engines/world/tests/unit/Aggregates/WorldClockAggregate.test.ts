import { describe, it, expect } from "vitest";
import { WorldClockAggregate } from "../../../src/Domain/Aggregates/WorldClockAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";

describe("WorldClockAggregate", () => {
    it("test_create_initializes_with_current_time", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        expect(aggregate.getTickCount()).toBe(0);
        expect(aggregate.getVersion().getValue()).toBe(0);
    });

    it("test_advance_time_moves_clock_forward_and_emits_event", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        aggregate.advanceTime(3600);
        expect(aggregate.getTickCount()).toBe(1);
        expect(aggregate.getVersion().getValue()).toBe(1);
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        expect(aggregate.getUncommittedEvents()[0].eventType).toBe("EVT_WORLD_TimeAdvanced");
    });

    it("test_advance_time_throws_with_non_positive_seconds", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        expect(() => aggregate.advanceTime(0)).toThrow();
        expect(() => aggregate.advanceTime(-1)).toThrow();
    });

    it("test_advance_time_wraps_past_midnight_and_increments_date", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        const initialDate = aggregate.getCalendarDate();
        aggregate.advanceTime(86400);
        expect(aggregate.getCalendarDate().getDay()).toBeGreaterThan(initialDate.getDay() - 1);
    });

    it("test_set_time_throws_when_moving_backward_within_same_day", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        aggregate.commitEvents();
        aggregate.advanceTime(3600);
        aggregate.commitEvents();
        const earlierTime = TimeOfDay.create(aggregate.getTimeOfDay().getHours() - 1, 0, 0);
        const sameDate = aggregate.getCalendarDate();
        expect(() => aggregate.setTime(earlierTime, sameDate)).toThrow("Clock cannot move backward within the same day.");
    });

    it("test_commit_events_clears_uncommitted_events", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        aggregate.advanceTime(100);
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        aggregate.commitEvents();
        expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
});

