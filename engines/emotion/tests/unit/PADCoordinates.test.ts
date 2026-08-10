import { describe, it, expect } from "vitest";
import { PADCoordinates } from "../../src/Domain/ValueObjects/PADCoordinates";
import { EmotionalDelta } from "../../src/Domain/ValueObjects/EmotionalDelta";

describe("PADCoordinates", () => {
    it("test_pad_coordinate_bounds_validation clamps pleasure to [-1.0, 1.0]", () => {
        const over = PADCoordinates.create(1.5, 0.5, 0.5);
        expect(over.getPleasure()).toBe(1.0);

        const under = PADCoordinates.create(-1.5, 0.5, 0.5);
        expect(under.getPleasure()).toBe(-1.0);
    });

    it("test_pad_coordinate_bounds_validation clamps arousal to [0.0, 1.0]", () => {
        const over = PADCoordinates.create(0.0, 1.5, 0.5);
        expect(over.getArousal()).toBe(1.0);

        const under = PADCoordinates.create(0.0, -0.5, 0.5);
        expect(under.getArousal()).toBe(0.0);
    });

    it("test_pad_coordinate_bounds_validation clamps dominance to [-1.0, 1.0]", () => {
        const over = PADCoordinates.create(0.0, 0.5, 1.5);
        expect(over.getDominance()).toBe(1.0);

        const under = PADCoordinates.create(0.0, 0.5, -1.5);
        expect(under.getDominance()).toBe(-1.0);
    });

    it("creates baseline coordinates correctly", () => {
        const baseline = PADCoordinates.baseline();
        expect(baseline.getPleasure()).toBe(0.0);
        expect(baseline.getArousal()).toBe(0.2);
        expect(baseline.getDominance()).toBe(0.5);
    });

    it("adds EmotionalDelta correctly", () => {
        const pad = PADCoordinates.create(0.0, 0.2, 0.5);
        const delta = EmotionalDelta.create(0.1, 0.1, 0.1);
        const result = pad.add(delta);
        expect(result.getPleasure()).toBeCloseTo(0.1);
        expect(result.getArousal()).toBeCloseTo(0.3);
        expect(result.getDominance()).toBeCloseTo(0.6);
    });

    it("interpolates toward target correctly", () => {
        const pad = PADCoordinates.create(0.0, 0.0, 0.0);
        const target = PADCoordinates.create(1.0, 1.0, 1.0);
        const result = pad.interpolateToward(target, 0.5);
        expect(result.getPleasure()).toBeCloseTo(0.5);
        expect(result.getArousal()).toBeCloseTo(0.5);
        expect(result.getDominance()).toBeCloseTo(0.5);
    });

    it("calculates distance correctly", () => {
        const a = PADCoordinates.create(0.0, 0.0, 0.0);
        const b = PADCoordinates.create(1.0, 1.0, 1.0);
        expect(a.distanceFrom(b)).toBeCloseTo(Math.sqrt(3));
    });
});
