import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { RelationshipEngine } from "../src/Infrastructure/RelationshipEngine";
import { RelationshipRepositoryImpl } from "../src/Infrastructure/Persistence/RelationshipRepositoryImpl";

describe("test_full_establish_to_decay_relationship_flow", () => {
    let mockEventBus: IEventBus;
    let mockStorage: IStorageEngine;
    let repository: RelationshipRepositoryImpl;
    let engine: RelationshipEngine;

    beforeEach(() => {
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn()
        } as any;

        const savedEntities: Map<string, any> = new Map();
        mockStorage = {
            getRepository: vi.fn().mockReturnValue({
                getById: vi.fn((key: string) => Promise.resolve(savedEntities.get(key) || null)),
                save: vi.fn((entity: any) => {
                    savedEntities.set(entity.id, entity);
                    return Promise.resolve();
                }),
                delete: vi.fn(),
                exists: vi.fn(),
                getAll: vi.fn(() => Promise.resolve(Array.from(savedEntities.values())))
            }),
            getUnitOfWork: vi.fn(),
            getEventStore: vi.fn(),
            getSnapshotStore: vi.fn(),
            getProjectionStore: vi.fn(),
            getWAL: vi.fn(),
            getDeltaLog: vi.fn(),
            getBackupStore: vi.fn(),
            getQuotaPolicy: vi.fn(),
            getCompressionEngine: vi.fn(),
            getDeduplicationEngine: vi.fn(),
            getEncryptionBoundary: vi.fn(),
            getCacheProvider: vi.fn(),
            getMigrationRunner: vi.fn(),
            getQuotaUsage: vi.fn(),
            interrupt: vi.fn(),
            recover: vi.fn(),
            eventBus: mockEventBus
        } as any;

        repository = new RelationshipRepositoryImpl(mockStorage);
        engine = new RelationshipEngine(mockEventBus, repository);
    });

    it("verifies establish -> interaction -> decay -> context flow", async () => {
        const snapshot = await engine.establishRelationship({
            relationshipId: "rel-1",
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            bondType: "friendship"
        });

        expect(snapshot.relationshipId).toBe("rel-1");
        expect(snapshot.bondType).toBe("friendship");

        const updated = await engine.updateRelationshipMetrics({
            relationshipId: "rel-1",
            trustDelta: 0.2,
            affinityDelta: 0.2,
            respectDelta: 0.1,
            loyaltyDelta: 0.1,
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: []
        });

        expect(updated.trust).toBeGreaterThan(0.5);

        await engine.executeRelationshipDecay("rel-1", 86400000 * 10);

        const context = await engine.getRelationshipContext("rel-1");
        expect(context.relationshipId).toBe("rel-1");
        expect(context.promptContext).toContain("Relationship:");
    });
});
