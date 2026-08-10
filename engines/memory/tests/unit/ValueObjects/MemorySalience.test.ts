import { describe, it, expect } from "vitest";
import { MemorySalience } from "../../../src/Domain/ValueObjects/MemorySalience";

describe("MemorySalience", () => {
    it("should create salience within bounds", () => {
        const salience = MemorySalience.create(0.5);
        expect(salience.getValue()).toBe(0.5);
    });

    it("should clamp salience to 0.0-1.0", () => {
        expect(MemorySalience.create(-0.5).getValue()).toBe(0.0);
        expect(MemorySalience.create(1.5).getValue()).toBe(1.0);
    });

    it("should throw for NaN", () => {
        expect(() => MemorySalience.create(NaN)).toThrow();
    });

    it("should decay correctly", () => {
        const salience = MemorySalience.create(0.8);
        const decayed = salience.decay(0.3);
        expect(decayed.getValue()).toBe(0.5);
    });

    it("should boost correctly", () => {
        const salience = MemorySalience.create(0.5);
        const boosted = salience.boost(0.3);
        expect(boosted.getValue()).toBe(0.8);
    });

    it("should not go below 0.0 on decay", () => {
        const salience = MemorySalience.create(0.1);
        const decayed = salience.decay(0.5);
        expect(decayed.getValue()).toBe(0.0);
    });

    it("should not exceed 1.0 on boost", () => {
        const salience = MemorySalience.create(0.9);
        const boosted = salience.boost(0.5);
        expect(boosted.getValue()).toBe(1.0);
    });
});
