import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "@nova-x-ai/core";
import { CharacterEngine } from "../../src/Infrastructure/CharacterEngine";
import { CreateCharacterCommand } from "../../src/Application/Commands/CreateCharacterCommand";
import { UpdateCharacterTraitsCommand } from "../../src/Application/Commands/UpdateCharacterTraitsCommand";
import { GetCharacterQuery } from "../../src/Application/Queries/GetCharacterQuery";
import { ListCharactersQuery } from "../../src/Application/Queries/ListCharactersQuery";

const createFakeRepository = () => {
    const store = new Map<string, any>();
    return {
        findById: async (id: string) => store.get(id) ?? null,
        save: async (aggregate: any) => {
            store.set(aggregate.getId().getValue(), aggregate);
        },
        delete: async (id: string) => { store.delete(id); },
        exists: async (id: string) => store.has(id),
        getAll: async () => Array.from(store.values()),
        getActiveCharacters: async () => {
            const all = await ({} as any).getAll();
            return all.filter((c: any) => c.getState().status.getValue() === "active");
        }
    };
};

describe("CharacterEngine Integration", () => {
    let eventBus: EventBus;
    let engine: CharacterEngine;

    beforeEach(() => {
        eventBus = new EventBus(1000);
        engine = new CharacterEngine(
            eventBus,
            createFakeRepository(),
            {} as any
        );
    });

    it("should publish CharacterCreatedEvent on create", async () => {
        let publishedEvent: any = null;
        eventBus.subscribe("EVT_CHAR_CharacterCreated", {
            handle: async (event: any) => {
                publishedEvent = event;
            }
        });

        const command = new CreateCharacterCommand(
            "Integration Hero",
            "Hero",
            "A brave test character for integration.",
            "Testing the engine",
            "Tester",
            [{ name: "openness", score: 0.8 }],
            "owner-123",
            { roles: ["user"], permissions: ["read"] }
        );

        await engine.createCharacter(command);
        expect(publishedEvent).not.toBeNull();
        expect(publishedEvent.eventType).toBe("EVT_CHAR_CharacterCreated");
        expect(publishedEvent.name).toBe("Integration Hero");
    });

    it("should publish CharacterTraitsUpdatedEvent on trait update", async () => {
        const createCommand = new CreateCharacterCommand(
            "Update Hero",
            "Hero",
            "A character for update testing.",
            "Testing updates",
            "Tester",
            [{ name: "openness", score: 0.5 }],
            "owner-123",
            { roles: ["user"], permissions: ["read"] }
        );
        await engine.createCharacter(createCommand);

        let publishedEvent: any = null;
        eventBus.subscribe("EVT_CHAR_CharacterTraitsUpdated", {
            handle: async (event: any) => {
                publishedEvent = event;
            }
        });

        const characters = await engine.listCharacters(new ListCharactersQuery());
        const characterId = characters[0].characterId;

        const updateCommand = new UpdateCharacterTraitsCommand(
            characterId,
            [{ name: "openness", score: 0.9 }],
            "owner-123",
            { roles: ["admin"], permissions: ["write"] }
        );

        await engine.updateCharacterTraits(updateCommand);
        expect(publishedEvent).not.toBeNull();
        expect(publishedEvent.eventType).toBe("EVT_CHAR_CharacterTraitsUpdated");
    });

    it("should get character by query", async () => {
        const command = new CreateCharacterCommand(
            "Query Hero",
            "Hero",
            "A character for query testing.",
            "Testing queries",
            "Tester",
            [{ name: "openness", score: 0.7 }],
            "owner-123",
            { roles: ["user"], permissions: ["read"] }
        );
        await engine.createCharacter(command);

        const characters = await engine.listCharacters(new ListCharactersQuery());
        const characterId = characters[0].characterId;

        const query = new GetCharacterQuery(characterId);
        const result = await engine.getCharacterById(query);
        expect(result).toBeDefined();
        expect(result.characterId).toBe(characterId);
    });
});
