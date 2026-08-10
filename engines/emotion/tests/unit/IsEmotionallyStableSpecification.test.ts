import { describe, it, expect } from "vitest";
import { IsEmotionallyStableSpecification } from "../../src/Domain/Specifications/IsEmotionallyStableSpecification";
import { EmotionAggregate } from "../../src/Domain/Aggregates/EmotionAggregate";
import { EmotionalStimulus } from "../../src/Domain/ValueObjects/EmotionalStimulus";

describe("IsEmotionallyStableSpecification", () => {
    it("returns true for stable aggregate", () => {
        const aggregate = EmotionAggregate.create("char-1");
        expect(IsEmotionallyStableSpecification.isSatisfiedBy(aggregate)).toBe(true);
    });

    it("returns false for unstable aggregate", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.9,
                valence: -0.9
            }),
            1.0
        );
        expect(IsEmotionallyStableSpecification.isSatisfiedBy(aggregate)).toBe(false);
    });
});
