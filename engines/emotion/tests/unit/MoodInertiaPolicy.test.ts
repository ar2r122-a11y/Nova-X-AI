import { describe, it, expect } from "vitest";
import { MoodInertiaPolicy } from "../../src/Domain/Policies/MoodInertiaPolicy";
import { EmotionalStimulus } from "../../src/Domain/ValueObjects/EmotionalStimulus";
import { MoodDescriptor } from "../../src/Domain/ValueObjects/MoodDescriptor";

describe("MoodInertiaPolicy", () => {
    it("test_mood_inertia_threshold_shift blocks low-intensity stimuli", () => {
        const mood = MoodDescriptor.neutral();
        const stimulus = EmotionalStimulus.create({
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.1,
            valence: 0.1
        });
        const canTransition = MoodInertiaPolicy.canTransition(mood, stimulus, 1.0);
        expect(canTransition).toBe(false);
    });

    it("test_mood_inertia_threshold_shift allows high-intensity stimuli", () => {
        const mood = MoodDescriptor.neutral();
        const stimulus = EmotionalStimulus.create({
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.8,
            valence: 0.8
        });
        const canTransition = MoodInertiaPolicy.canTransition(mood, stimulus, 1.0);
        expect(canTransition).toBe(true);
    });
});
