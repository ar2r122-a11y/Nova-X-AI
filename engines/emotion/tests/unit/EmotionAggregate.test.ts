import { describe, it, expect } from "vitest";
import { EmotionAggregate } from "../../src/Domain/Aggregates/EmotionAggregate";
import { EmotionalStimulus } from "../../src/Domain/ValueObjects/EmotionalStimulus";

describe("EmotionAggregate", () => {
    it("test_baseline_creation creates with correct defaults", () => {
        const aggregate = EmotionAggregate.create("char-1");
        expect(aggregate.getCharacterId()).toBe("char-1");
        expect(aggregate.getPAD().getPleasure()).toBe(0.0);
        expect(aggregate.getPAD().getArousal()).toBe(0.2);
        expect(aggregate.getPAD().getDominance()).toBe(0.5);
        expect(aggregate.getPrimaryEmotion().getValue()).toBe("neutral");
        expect(aggregate.getIntensity()).toBe(0.0);
        expect(aggregate.getEmotionalState()).toBe("baseline");
        expect(aggregate.getTotalStimuliProcessed()).toBe(0);
    });

    it("test_baseline_reset resets to baseline", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.8,
                valence: 0.5
            }),
            1.0
        );
        expect(aggregate.getEmotionalState()).not.toBe("baseline");

        aggregate.resetBaseline();
        expect(aggregate.getPAD().getPleasure()).toBe(0.0);
        expect(aggregate.getPAD().getArousal()).toBe(0.2);
        expect(aggregate.getPAD().getDominance()).toBe(0.5);
        expect(aggregate.getPrimaryEmotion().getValue()).toBe("neutral");
        expect(aggregate.getEmotionalState()).toBe("baseline");
        expect(aggregate.getIntensity()).toBe(0.0);
    });

    it("test_emotional_history_limit respects max ledger size", () => {
        const aggregate = EmotionAggregate.create("char-1");
        for (let i = 0; i < 60; i++) {
            aggregate.applyStimulus(
                EmotionalStimulus.create({
                    sourceId: "test",
                    stimulusType: "dialogue",
                    intensity: 0.5,
                    valence: 0.1
                }),
                1.0
            );
        }
        expect(aggregate.getLedgers().length).toBeLessThanOrEqual(50);
    });

    it("test_statistics tracks total stimuli processed", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.5,
                valence: 0.1
            }),
            1.0
        );
        expect(aggregate.getTotalStimuliProcessed()).toBe(1);
    });

    it("test_peak_arousal_recorded tracks max arousal", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 1.0,
                valence: 0.8
            }),
            1.0
        );
        expect(aggregate.getPeakArousalRecorded()).toBeGreaterThanOrEqual(aggregate.getPAD().getArousal());
    });

    it("emits events on stimulus", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.5,
                valence: 0.1
            }),
            1.0
        );
        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBeGreaterThan(0);
        aggregate.commitEvents();
        expect(aggregate.getUncommittedEvents().length).toBe(0);
    });

    it("reconstitute restores aggregate from snapshot", () => {
        const aggregate = EmotionAggregate.create("char-1");
        aggregate.applyStimulus(
            EmotionalStimulus.create({
                sourceId: "test",
                stimulusType: "dialogue",
                intensity: 0.8,
                valence: 0.5
            }),
            1.0
        );
        const snapshot = aggregate.getSnapshot();
        const restored = EmotionAggregate.reconstitute(snapshot as any);
        expect(restored.getCharacterId()).toBe("char-1");
        expect(restored.getPrimaryEmotion().getValue()).toBe(aggregate.getPrimaryEmotion().getValue());
    });
});
