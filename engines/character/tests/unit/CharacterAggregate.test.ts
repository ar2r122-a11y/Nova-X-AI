import { describe, it, expect } from "vitest";
import { CharacterAggregateFactory } from "../../src/Domain/Services/CharacterAggregateFactory";
import { CharacterId, CharacterStatus } from "../../src/Domain/ValueObjects";
import { PersonalityTrait } from "../../src/Domain/ValueObjects";
import { CharacterStateChangedEvent, CharacterTraitsUpdatedEvent } from "../../src/Domain/Events";

describe("CharacterAggregate", () => {
    it("should be instantiable from factory", () => {
        const template = {
            name: "Test Character",
            title: "Hero",
            origin: "Earth",
            age: "25",
            biography: "A test character.",
            tagline: "Testing",
            occupation: "Tester",
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
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        expect(aggregate).toBeDefined();
        expect(aggregate.getId()).toBeInstanceOf(CharacterId);
        expect(aggregate.getName()).toBe("Test Character");
    });

    it("should emit CharacterStateChangedEvent on state update", () => {
        const template = {
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
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        aggregate.updateState({ status: CharacterStatus.create("active") });
        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBe(1);
        expect(events[0]).toBeInstanceOf(CharacterStateChangedEvent);
        expect((events[0] as CharacterStateChangedEvent).newStatus).toBe("active");
    });

    it("should emit CharacterTraitsUpdatedEvent on trait update", () => {
        const template = {
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
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        const traitsMap = new Map<string, any>();
        traitsMap.set("openness", PersonalityTrait.create("openness", 0.8));
        aggregate.updateTraits(traitsMap);
        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBe(1);
        expect(events[0]).toBeInstanceOf(CharacterTraitsUpdatedEvent);
    });

    it("should commit events and clear uncommitted queue", () => {
        const template = {
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
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        aggregate.updateState({ status: CharacterStatus.create("active") });
        expect(aggregate.getUncommittedEvents().length).toBe(1);
        aggregate.commitEvents();
        expect(aggregate.getUncommittedEvents().length).toBe(0);
    });

    it("should snapshot and restore aggregate state", () => {
        const template = {
            name: "Test",
            title: "T",
            origin: "Earth",
            age: "25",
            biography: "Bio",
            tagline: "Tag",
            occupation: "Job",
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
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        aggregate.updateState({ status: CharacterStatus.create("active") });
        const snapshot = aggregate.getSnapshot();

        const restored = CharacterAggregateFactory.createFromTemplate(template);
        restored.restoreFromSnapshot(snapshot);
        expect(restored.getState().status.getValue()).toBe("active");
    });
});
