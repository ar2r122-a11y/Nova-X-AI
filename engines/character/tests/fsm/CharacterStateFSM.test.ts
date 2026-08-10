import { describe, it, expect } from "vitest";
import { CharacterAggregateFactory } from "../../src/Domain/Services/CharacterAggregateFactory";
import { CharacterInvariantsValidator } from "../../src/Domain/Services/CharacterInvariantsValidator";
import { CharacterStatus } from "../../src/Domain/ValueObjects";

describe("Character State FSM", () => {
    const createTemplate = (status: string = "unloaded") => ({
        name: "Test",
        title: "T",
        origin: "",
        age: "",
        biography: "",
        tagline: "",
        occupation: "",
        publicNotes: "",
        visualDescription: "",
        avatarUri: "",
        clothingStyle: "casual",
        distinguishingMarks: "",
        tone: "neutral",
        pitch: 1.0,
        speechTempo: "normal",
            vocabularyLevel: 0.5,
        dialectNotes: [] as string[],
        knownFacts: [] as string[],
        expertiseAreas: [] as string[],
        blindSpots: [] as string[],
        activeGoals: [] as Array<{ description: string; status: string; progress: number }>,
        motivations: [] as string[],
        schedule: [] as Array<{ timeBlock: string; activity: string; worldCoordinate?: string }>,
        fallbackBehavior: "idle",
        skillMatrix: [] as Array<{ skillName: string; level: number }>,
        inventoryItems: [] as Array<{ id: string; name: string; status: string; description?: string }>,
        affinityMap: [] as Array<{ targetId: string; trust: number; affection: number; familiarity: number }>,
        currentEmotion: "neutral",
        arousalLevel: 0.5,
        interactionCount: 0,
        evolutionStage: "initial",
        allowedActions: [] as string[],
        toolAccess: "user",
        privateBoundaries: [] as string[],
        accessControlList: [] as string[],
        currentLocation: "unknown",
        characterStatus: status,
        energyLevel: 1.0,
        moralAlignment: "neutral",
        quirks: [] as string[],
        fears: [] as string[],
        desires: [] as string[],
        traits: [] as Array<{ name: string; score: number }>
    });

    it("should allow transition from unloaded to active", () => {
        CharacterInvariantsValidator.validateStateTransition("unloaded", "active");
    });

    it("should allow transition from active to sleeping", () => {
        CharacterInvariantsValidator.validateStateTransition("active", "sleeping");
    });

    it("should allow transition from sleeping to active", () => {
        CharacterInvariantsValidator.validateStateTransition("sleeping", "active");
    });

    it("should allow transition from active to incapacitated", () => {
        CharacterInvariantsValidator.validateStateTransition("active", "incapacitated");
    });

    it("should allow transition from incapacitated to active", () => {
        CharacterInvariantsValidator.validateStateTransition("incapacitated", "active");
    });

    it("should allow transition from active to hibernating", () => {
        CharacterInvariantsValidator.validateStateTransition("active", "hibernating");
    });

    it("should return false for invalid transition", () => {
        expect(CharacterInvariantsValidator.validateStateTransition("unloaded", "sleeping")).toBe(false);
    });

    it("should return false for transition to invalid state", () => {
        expect(CharacterInvariantsValidator.validateStateTransition("active", "invalid")).toBe(false);
    });

    it("should emit correct events for state transitions", () => {
        const aggregate = CharacterAggregateFactory.createFromTemplate(createTemplate("unloaded"));
        aggregate.updateState({ status: CharacterStatus.create("active") });
        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBe(1);
        expect(events[0].eventType).toBe("EVT_CHAR_CharacterStateChanged");
    });
});
