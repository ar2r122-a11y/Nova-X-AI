import { describe, it, expect } from "vitest";
import { WorldAggregate } from "../../../src/Domain/Aggregates/WorldAggregate";
import { WorldId } from "../../../src/Domain/ValueObjects/WorldId";
import { RegionId } from "../../../src/Domain/ValueObjects/RegionId";
import { GlobalVariableKey } from "../../../src/Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../../../src/Domain/ValueObjects/GlobalVariableValue";

describe("WorldAggregate", () => {
    it("test_create_sets_initialized_state_and_emits_event", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        expect(aggregate.getWorldState().getValue()).toBe("initialized");
        expect(aggregate.getVersion().getValue()).toBe(0);
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        expect(aggregate.getUncommittedEvents()[0].eventType).toBe("EVT_WORLD_WorldInitialized");
    });

    it("test_activate_transitions_state_to_active", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        expect(aggregate.getWorldState().getValue()).toBe("active");
        expect(aggregate.getVersion().getValue()).toBe(1);
    });

    it("test_activate_throws_when_not_initialized", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.activate();
        expect(() => aggregate.activate()).toThrow();
    });

    it("test_start_simulation_transitions_to_running", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        expect(aggregate.getWorldState().getValue()).toBe("simulation_running");
    });

    it("test_pause_time_transitions_to_paused", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        aggregate.pauseTime();
        expect(aggregate.getWorldState().getValue()).toBe("time_paused");
    });

    it("test_resume_simulation_returns_to_running", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        aggregate.pauseTime();
        aggregate.commitEvents();
        aggregate.resumeSimulation();
        expect(aggregate.getWorldState().getValue()).toBe("simulation_running");
    });

    it("test_enter_environmental_shift_transitions_state", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.startSimulation();
        aggregate.commitEvents();
        aggregate.enterEnvironmentalShift();
        expect(aggregate.getWorldState().getValue()).toBe("environmental_shift");
    });

    it("test_archive_marks_world_as_archived", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.activate();
        aggregate.commitEvents();
        aggregate.archive();
        expect(aggregate.getWorldState().getValue()).toBe("archived");
    });

    it("test_set_global_variable_stores_value_and_emits_event", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.setGlobalVariable(GlobalVariableKey.create("dayCount"), GlobalVariableValue.number(1));
        expect(aggregate.getGlobalVariables().get("dayCount")?.getValue()).toBe(1);
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        expect(aggregate.getUncommittedEvents()[0].eventType).toBe("EVT_WORLD_GlobalVariableUpdated");
    });

    it("test_register_region_adds_region_and_increments_version", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        aggregate.registerRegion(RegionId.create("region-1"));
        expect(aggregate.getRegionIds()).toHaveLength(1);
        expect(aggregate.getVersion().getValue()).toBe(1);
    });

    it("test_register_region_throws_when_max_regions_reached", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        aggregate.commitEvents();
        for (let i = 0; i < 10; i++) {
            aggregate.registerRegion(RegionId.create(`region-${i}`));
        }
        expect(() => aggregate.registerRegion(RegionId.create("region-11"))).toThrow("Maximum number of regions (10) reached.");
    });

    it("test_commit_events_clears_uncommitted_events", () => {
        const aggregate = WorldAggregate.create(WorldId.create("world-1"), "Test World");
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
        aggregate.commitEvents();
        expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
});

