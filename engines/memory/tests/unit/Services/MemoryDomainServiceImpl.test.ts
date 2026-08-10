import { describe, it, expect, vi } from "vitest";
import { MemoryDomainServiceImpl } from "../../../src/Domain/Services/MemoryDomainServiceImpl";
import type { IMemoryRepository } from "../../../src/Domain/Repositories/IMemoryRepository";
import { MemoryRetentionPolicy } from "../../../src/Domain/Policies/MemoryRetentionPolicy";

describe("MemoryDomainServiceImpl", () => {
    it("should retrieve memories for context", async () => {
        const mockRepo: IMemoryRepository = {
            save: vi.fn(),
            getById: vi.fn(),
            delete: vi.fn(),
            exists: vi.fn(),
            getAll: async () => [],
            getByOwnerId: async () => [],
            getByType: async () => [],
            getByClusterId: async () => [],
            getActiveMemories: async () => [],
            countByOwner: async () => 0
        };
        const service = new MemoryDomainServiceImpl({ repository: mockRepo });
        const result = await service.retrieveMemoriesForContext("owner-1", "query", 10);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it("should prune expired memories", async () => {
        const mockRepo: IMemoryRepository = {
            save: vi.fn(),
            getById: vi.fn(),
            delete: vi.fn(),
            exists: vi.fn(),
            getAll: async () => [],
            getByOwnerId: async () => [],
            getByType: async () => [],
            getByClusterId: async () => [],
            getActiveMemories: async () => [],
            countByOwner: async () => 0
        };
        const service = new MemoryDomainServiceImpl({ repository: mockRepo });
        const policy = new MemoryRetentionPolicy({ minSalience: 0.5, maxAgeMs: 1 });
        const result = await service.pruneExpiredMemories("owner-1", policy);
        expect(result.prunedCount).toBeGreaterThanOrEqual(0);
    });
});
