import { describe, it, expect } from "vitest";
import { IsClockAdvanceableSpecification } from "../../../src/Domain/Specifications/IsClockAdvanceableSpecification";
import { WorldClockAggregate } from "../../../src/Domain/Aggregates/WorldClockAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("IsClockAdvanceableSpecification", () => {
    it("test_returns_true_for_new_clock", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        expect(IsClockAdvanceableSpecification.isSatisfiedBy(aggregate)).toBe(true);
    });

    it("test_returns_true_after_advances", () => {
        const aggregate = WorldClockAggregate.create(WorldId.create("world-1"));
        aggregate.advanceTime(3600);
        aggregate.commitEvents();
        expect(IsClockAdvanceableSpecification.isSatisfiedBy(aggregate)).toBe(true);
    });
});

