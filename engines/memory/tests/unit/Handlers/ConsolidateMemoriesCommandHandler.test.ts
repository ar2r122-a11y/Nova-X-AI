import { describe, it, expect, vi } from "vitest";
import { ConsolidateMemoriesCommandHandler } from "../../../src/Application/Handlers/ConsolidateMemoriesCommandHandler";
import { ConsolidateMemoriesCommand } from "../../../src/Application/Commands/ConsolidateMemoriesCommand";

describe("ConsolidateMemoriesCommandHandler", () => {
    it("should reject unauthorized consolidation", async () => {
        const handler = new ConsolidateMemoriesCommandHandler({
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

        const command = new ConsolidateMemoriesCommand("owner-1", ["mem-1", "mem-2"], undefined, { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthorized");
    });

    it("should reject less than 2 memories", async () => {
        const handler = new ConsolidateMemoriesCommandHandler({
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

        const command = new ConsolidateMemoriesCommand("owner-1", ["mem-1"], undefined, { roles: ["admin"], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("at least 2");
    });
});
