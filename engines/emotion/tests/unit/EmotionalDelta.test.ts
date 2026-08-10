import { describe, it, expect } from "vitest";
import { EmotionalDelta } from "../../src/Domain/ValueObjects/EmotionalDelta";

describe("EmotionalDelta", () => {
    it("creates delta correctly", () => {
        const delta = EmotionalDelta.create(0.1, 0.2, 0.3);
        expect(delta.pleasure).toBe(0.1);
        expect(delta.arousal).toBe(0.2);
        expect(delta.dominance).toBe(0.3);
    });

    it("scales correctly", () => {
        const delta = EmotionalDelta.create(0.1, 0.2, 0.3);
        const scaled = delta.scale(2.0);
        expect(scaled.pleasure).toBe(0.2);
        expect(scaled.arousal).toBe(0.4);
        expect(scaled.dominance).toBe(0.6);
    });

    it("adds correctly", () => {
        const a = EmotionalDelta.create(0.1, 0.2, 0.3);
        const b = EmotionalDelta.create(0.1, 0.2, 0.3);
        const sum = a.add(b);
        expect(sum.pleasure).toBe(0.2);
        expect(sum.arousal).toBe(0.4);
        expect(sum.dominance).toBe(0.6);
    });

    it("calculates magnitude correctly", () => {
        const delta = EmotionalDelta.create(0.0, 3.0, 4.0);
        expect(delta.getMagnitude()).toBe(5.0);
    });

    it("creates zero delta", () => {
        const zero = EmotionalDelta.zero();
        expect(zero.pleasure).toBe(0.0);
        expect(zero.arousal).toBe(0.0);
        expect(zero.dominance).toBe(0.0);
    });
});
