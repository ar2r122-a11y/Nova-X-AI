import { describe, it, expect } from "vitest";
import { IsWorldActiveSpecification } from "../../../src/Domain/Specifications/IsWorldActiveSpecification";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";

describe("IsWorldActiveSpecification", () => {
    it("test_returns_true_for_active_world", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        expect(IsWorldActiveSpecification.isSatisfiedBy(aggregate)).toBe(true);
    });

    it("test_returns_true_for_simulation_running", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        expect(IsWorldActiveSpecification.isSatisfiedBy(aggregate)).toBe(true);
    });

    it("test_returns_false_for_initialized_world", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        expect(IsWorldActiveSpecification.isSatisfiedBy(aggregate)).toBe(false);
    });

    it("test_returns_false_for_archived_world", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.archive();
        expect(IsWorldActiveSpecification.isSatisfiedBy(aggregate)).toBe(false);
    });
});

