import { describe, it, expect } from "vitest";
import { MoodDescriptor } from "../../src/Domain/ValueObjects/MoodDescriptor";

describe("MoodDescriptor", () => {
    it("creates neutral mood", () => {
        const mood = MoodDescriptor.neutral();
        expect(mood.getMoodName()).toBe("neutral");
        expect(mood.getStabilityWeight()).toBe(1.0);
    });

    it("clamps stability weight", () => {
        const mood = MoodDescriptor.create("cheerful", 1.5);
        expect(mood.getStabilityWeight()).toBe(1.0);
    });

    it("fromPAD returns cheerful for high pleasure and high arousal", () => {
        const mood = MoodDescriptor.fromPAD(0.5, 0.7);
        expect(mood.getMoodName()).toBe("cheerful");
    });

    it("fromPAD returns gloomy for low pleasure and low arousal", () => {
        const mood = MoodDescriptor.fromPAD(-0.5, 0.3);
        expect(mood.getMoodName()).toBe("gloomy");
    });

    it("fromPAD returns agitated for low pleasure and high arousal", () => {
        const mood = MoodDescriptor.fromPAD(-0.5, 0.7);
        expect(mood.getMoodName()).toBe("agitated");
    });

    it("equals compares correctly", () => {
        const a = MoodDescriptor.neutral();
        const b = MoodDescriptor.neutral();
        expect(a.equals(b)).toBe(true);
    });
});
