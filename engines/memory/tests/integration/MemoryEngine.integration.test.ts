import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "@nova-x-ai/core";
import { MemoryEngine } from "../../src/Infrastructure/MemoryEngine";
import { StoreMemoryCommand } from "../../src/Application/Commands/StoreMemoryCommand";

const createFakeRepository = () => {
    const store = new Map<string, any>();
    return {
        save: async (memory: any) => { store.set(memory.getId().getValue(), memory); },
        getById: async (id: string) => store.get(id) ?? null,
        delete: async (id: string) => { store.delete(id); },
        exists: async (id: string) => store.has(id),
        getAll: async () => Array.from(store.values()),
        getByOwnerId: async () => Array.from(store.values()),
        getByType: async () => Array.from(store.values()),
        getByClusterId: async () => Array.from(store.values()),
        getActiveMemories: async () => Array.from(store.values()).filter((m: any) => m.getState().isActive()),
        countByOwner: async () => store.size
    };
};

describe("MemoryEngine Integration", () => {
    let eventBus: EventBus;
    let engine: MemoryEngine;

    beforeEach(() => {
        eventBus = new EventBus(1000);
        engine = new MemoryEngine(eventBus, createFakeRepository());
    });

    it("should store a memory", async () => {
        const command = new StoreMemoryCommand(
            "test memory",
            "episodic",
            "owner-1",
            0.8,
            ["test"],
            { roles: ["user"], permissions: [] }
        );
        const result = await engine.storeMemory(command);
        expect(result).toBeDefined();
        expect(result.content).toBe("test memory");
        expect(result.ownerId).toBe("owner-1");
    });

    it("should retrieve memories for character", async () => {
        const command = new StoreMemoryCommand(
            "memory1",
            "episodic",
            "owner-1",
            0.9,
            ["test"],
            { roles: ["user"], permissions: [] }
        );
        await engine.storeMemory(command);

        const memories = await engine.getMemoriesForCharacter({
            ownerId: "owner-1",
            requesterId: "owner-1",
            limit: 10,
            minSalience: 0.0
        } as any);
        expect(memories.length).toBeGreaterThanOrEqual(1);
    });

    it("should get memory context", async () => {
        const command = new StoreMemoryCommand(
            "context memory",
            "semantic",
            "owner-1",
            0.8,
            ["context"],
            { roles: ["user"], permissions: [] }
        );
        await engine.storeMemory(command);

        const context = await engine.getMemoryContext({
            ownerId: "owner-1",
            contextTokenLimit: 4096,
            memoryTypes: ["semantic"],
            requesterId: "owner-1"
        } as any);
        expect(context).toBeDefined();
        expect(context.memories.length).toBeGreaterThanOrEqual(1);
    });
});
