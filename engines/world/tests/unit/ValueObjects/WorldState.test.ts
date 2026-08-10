import { describe, it, expect } from "vitest";
import { WorldStateRef } from "../../../src/Domain/ValueObjects/WorldState";

describe("WorldStateRef", () => {
    it("test_creation_succeeds_with_valid_states", () => {
        expect(WorldStateRef.create("initialized").getValue()).toBe("initialized");
        expect(WorldStateRef.active().getValue()).toBe("active");
        expect(WorldStateRef.simulationRunning().getValue()).toBe("simulation_running");
        expect(WorldStateRef.timePaused().getValue()).toBe("time_paused");
        expect(WorldStateRef.environmentalShift().getValue()).toBe("environmental_shift");
        expect(WorldStateRef.archived().getValue()).toBe("archived");
    });

    it("test_creation_throws_with_invalid_state", () => {
        expect(() => WorldStateRef.create("invalid" as any)).toThrow("Invalid WorldState");
    });

    it("test_equality_works_correctly", () => {
        expect(WorldStateRef.active().equals(WorldStateRef.active())).toBe(true);
        expect(WorldStateRef.active().equals(WorldStateRef.archived())).toBe(false);
    });
});

