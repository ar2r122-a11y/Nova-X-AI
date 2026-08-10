import { describe, it, expect, vi } from "vitest";
import { PruneMemoriesCommandHandler } from "../../../src/Application/Handlers/PruneMemoriesCommandHandler";
import { PruneMemoriesCommand } from "../../../src/Application/Commands/PruneMemoriesCommand";

describe("PruneMemoriesCommandHandler", () => {
    it("should prune expired memories", async () => {
        const publishFn = vi.fn(async () => {});
        const handler = new PruneMemoriesCommandHandler({
            getByOwnerId: async () => [],
            save: async () => {},
            getAll: async () => [],
            getById: async () => null,
            delete: async () => {},
            exists: async () => false,
            getByType: async () => [],
            getByClusterId: async () => [],
            getActiveMemories: async () => [],
            countByOwner: async () => 0
        } as any, { publish: publishFn } as any);

        const command = new PruneMemoriesCommand("owner-1", 0.1, 1000000000, { roles: ["admin"], permissions: [] });
        const result = await handler.handle(command);
        expect(result).toBeDefined();
        expect(result.prunedCount).toBe(0);
    });

    it("should reject unauthorized prune", async () => {
        const handler = new PruneMemoriesCommandHandler({
            getByOwnerId: async () => [],
            save: async () => {},
            getAll: async () => [],
            getById: async () => null,
            delete: async () => {},
            exists: async () => false,
            getByType: async () => [],
            getByClusterId: async () => [],
            getActiveMemories: async () => [],
            countByOwner: async () => 0
        } as any, { publish: vi.fn() } as any);

        const command = new PruneMemoriesCommand("owner-1", 0.1, 1000000000, { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthorized");
    });
});
