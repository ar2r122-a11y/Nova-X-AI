import { describe, it, expect, vi } from "vitest";
import { CreateCharacterCommandHandler } from "../../src/Application/Handlers/CreateCharacterCommandHandler";
import { UpdateCharacterTraitsCommandHandler } from "../../src/Application/Handlers/UpdateCharacterTraitsCommandHandler";
import { GetCharacterQueryHandler } from "../../src/Application/Handlers/GetCharacterQueryHandler";
import { CreateCharacterCommand } from "../../src/Application/Commands/CreateCharacterCommand";
import { UpdateCharacterTraitsCommand } from "../../src/Application/Commands/UpdateCharacterTraitsCommand";
import { GetCharacterQuery } from "../../src/Application/Queries/GetCharacterQuery";
import { CharacterAggregateFactory } from "../../src/Domain/Services/CharacterAggregateFactory";

function makeCreateCommand() {
    return new CreateCharacterCommand(
        "Test Hero",
        "Hero",
        "A brave test character.",
        "Testing the engine",
        "Tester",
        "", "", "", "", "",
        [], [],
        "", "", "", "", "", "", "", "", "", "", "", "",
        [],
        "", "", "",
        [], [], [],
        "",
        [],
        "", "",
        [], [], [], [],
        [{ name: "openness", score: 0.8 }],
        "owner-123",
        { roles: ["user"], permissions: ["read"] }
    );
}

describe("Handlers", () => {
    it("CreateCharacterCommandHandler should create character", async () => {
        const saveFn = vi.fn(async () => {});
        const publishFn = vi.fn(async () => {});
        const mockRepo = {
            getAll: async () => [],
            save: saveFn
        };
        const mockEventBus = {
            publish: publishFn
        };
        const handler = new CreateCharacterCommandHandler({
            getRepository: () => mockRepo
        } as any, mockEventBus as any);

        const command = makeCreateCommand();

        await handler.handle(command);
        expect(saveFn).toHaveBeenCalledTimes(1);
        expect(publishFn).toHaveBeenCalledTimes(1);
    });

    it("UpdateCharacterTraitsCommandHandler should update traits", async () => {
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
            characterStatus: "active",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        const saveFn = vi.fn(async () => {});
        const publishFn = vi.fn(async () => {});
        const mockRepo = {
            findById: async () => aggregate,
            save: saveFn
        };
        const mockEventBus = {
            publish: publishFn
        };
        const handler = new UpdateCharacterTraitsCommandHandler({
            getRepository: () => mockRepo
        } as any, mockEventBus as any);

        const command = new UpdateCharacterTraitsCommand(
            aggregate.getId().getValue(),
            [{ name: "openness", score: 0.9 }],
            aggregate.getId().getValue(),
            { roles: ["admin"], permissions: ["write"] }
        );

        await handler.handle(command);
        expect(saveFn).toHaveBeenCalledTimes(1);
        expect(publishFn).toHaveBeenCalledTimes(1);
    });

    it("GetCharacterQueryHandler should return profile DTO", async () => {
        const template = {
            name: "Test",
            title: "T",
            origin: "",
            age: "",
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
            characterStatus: "active",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: [] as Array<{ name: string; score: number }>
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        const mockRepo = {
            findById: async () => aggregate
        };
        const handler = new GetCharacterQueryHandler({
            getRepository: () => mockRepo
        } as any);

        const query = new GetCharacterQuery(aggregate.getId().getValue());
        const result = await handler.handle(query);
        expect(result).toBeDefined();
        expect(result.characterId).toBe(aggregate.getId().getValue());
    });
});
