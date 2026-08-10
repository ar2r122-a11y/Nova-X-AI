import { describe, it, expect } from "vitest";
import { AuthorizationPolicy } from "../../src/Domain/Policies/AuthorizationPolicy";
import { PrivacyBoundaryEnforcementPolicy } from "../../src/Domain/Policies/PrivacyBoundaryEnforcementPolicy";
import { IsActiveCharacterSpecification } from "../../src/Domain/Policies/IsActiveCharacterSpecification";
import { CharacterAggregateFactory } from "../../src/Domain/Services/CharacterAggregateFactory";

describe("Policies", () => {
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

    it("AuthorizationPolicy should allow owner to update traits", () => {
        const policy = new AuthorizationPolicy();
        const ownerId = "owner-123";
        const requesterId = "owner-123";
        expect(policy.canUpdateTraits(requesterId, ownerId, ["user"])).toBe(true);
    });

    it("AuthorizationPolicy should allow admin to update any character", () => {
        const policy = new AuthorizationPolicy();
        expect(policy.canUpdateTraits("admin-1", "owner-123", ["admin"])).toBe(true);
    });

    it("AuthorizationPolicy should deny unauthorized user", () => {
        const policy = new AuthorizationPolicy();
        expect(policy.canUpdateTraits("other-user", "owner-123", ["user"])).toBe(false);
    });

    it("PrivacyBoundaryEnforcementPolicy should enforce boundaries", () => {
        const policy = new PrivacyBoundaryEnforcementPolicy();
        const template = createTemplate("active");
        template.privateBoundaries = ["no_personal_info"];
        const aggregate = CharacterAggregateFactory.createFromTemplate(template);

        const result = policy.enforce(aggregate, "user-1", []);
        expect(result.allowed).toBe(false);
    });

    it("IsActiveCharacterSpecification should identify active characters", () => {
        const spec = new IsActiveCharacterSpecification();
        const activeAggregate = CharacterAggregateFactory.createFromTemplate(createTemplate("active"));
        const inactiveAggregate = CharacterAggregateFactory.createFromTemplate(createTemplate("sleeping"));

        expect(spec.isSatisfiedBy(activeAggregate)).toBe(true);
        expect(spec.isSatisfiedBy(inactiveAggregate)).toBe(false);
    });
});
