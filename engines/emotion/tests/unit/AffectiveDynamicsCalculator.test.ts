import { describe, it, expect } from "vitest";
import { AffectiveDynamicsCalculator } from "../../src/Domain/Services/AffectiveDynamicsCalculator";
import { PADCoordinates } from "../../src/Domain/ValueObjects/PADCoordinates";
import { EmotionalStimulus } from "../../src/Domain/ValueObjects/EmotionalStimulus";

describe("AffectiveDynamicsCalculator", () => {
    const calculator = new AffectiveDynamicsCalculator();

    it("test_emotional_decay_calculation decays toward baseline", () => {
        const current = PADCoordinates.create(0.8, 0.9, 0.8);
        const baseline = PADCoordinates.baseline();
        const result = calculator.calculateDecay(current, baseline, 0.05);
        expect(result.getArousal()).toBeLessThan(current.getArousal());
        expect(result.getPleasure()).toBeLessThan(current.getPleasure());
    });

    it("calculatePadShift applies stimulus with sensitivity", () => {
        const current = PADCoordinates.create(0.0, 0.2, 0.5);
        const stimulus = EmotionalStimulus.create({
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.8,
            valence: 0.5
        });
        const result = calculator.calculatePadShift(current, stimulus, 1.0);
        expect(result.getPleasure()).toBeGreaterThan(current.getPleasure());
        expect(result.getArousal()).toBeGreaterThan(current.getArousal());
    });

    it("calculatePadShift respects sensitivity", () => {
        const current = PADCoordinates.create(0.0, 0.2, 0.5);
        const stimulus = EmotionalStimulus.create({
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.8,
            valence: 0.5
        });
        const full = calculator.calculatePadShift(current, stimulus, 1.0);
        const half = calculator.calculatePadShift(current, stimulus, 0.5);
        const fullDelta = full.getPleasure() - current.getPleasure();
        const halfDelta = half.getPleasure() - current.getPleasure();
        expect(halfDelta).toBeCloseTo(fullDelta * 0.5, 5);
    });
});
