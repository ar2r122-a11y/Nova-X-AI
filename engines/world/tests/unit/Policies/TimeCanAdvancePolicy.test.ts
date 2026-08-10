import { describe, it, expect } from "vitest";
import { TimeCanAdvancePolicy } from "../../../src/Domain/Policies/TimeCanAdvancePolicy";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("TimeCanAdvancePolicy", () => {
    it("test_allows_advance_when_simulation_running", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        expect(TimeCanAdvancePolicy.canAdvance(aggregate, 3600)).toBe(true);
    });

    it("test_denies_advance_when_not_simulation_running", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        expect(TimeCanAdvancePolicy.canAdvance(aggregate, 3600)).toBe(false);
    });

    it("test_denies_advance_with_non_positive_seconds", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        expect(TimeCanAdvancePolicy.canAdvance(aggregate, 0)).toBe(false);
        expect(TimeCanAdvancePolicy.canAdvance(aggregate, -1)).toBe(false);
    });
});

