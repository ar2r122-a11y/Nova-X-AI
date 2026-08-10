import { describe, it, expect, vi } from "vitest";
import { StoreMemoryCommandHandler } from "../../../src/Application/Handlers/StoreMemoryCommandHandler";
import { StoreMemoryCommand } from "../../../src/Application/Commands/StoreMemoryCommand";

describe("StoreMemoryCommandHandler", () => {
    it("should store memory", async () => {
        const publishFn = vi.fn(async () => {});
        const handler = new StoreMemoryCommandHandler(
            { publish: publishFn } as any,
            {
                save: async () => {},
                getById: async () => null,
                delete: async () => {},
                exists: async () => false,
                getAll: async () => [],
                getByOwnerId: async () => [],
                getByType: async () => [],
                getByClusterId: async () => [],
                getActiveMemories: async () => [],
                countByOwner: async () => 0
            } as any
        );

        const command = new StoreMemoryCommand(
            "test content",
            "episodic",
            "owner-1",
            0.8,
            ["test"],
            { roles: ["user"], permissions: ["read"] }
        );

        const result = await handler.handle(command);
        expect(result).toBeDefined();
        expect(result.memoryType).toBe("episodic");
        expect(result.ownerId).toBe("owner-1");
    });
});
