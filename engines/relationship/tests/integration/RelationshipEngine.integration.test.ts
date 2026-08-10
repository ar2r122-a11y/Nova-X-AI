import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { RelationshipEngine } from "../../src/Infrastructure/RelationshipEngine";
import { RelationshipRepositoryImpl } from "../../src/Infrastructure/Persistence/RelationshipRepositoryImpl";

describe("test_relationship_engine_with_persistence_and_event_bus", () => {
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

    it("establishes relationship and publishes event", async () => {
        const dto = await engine.establishRelationship({
            relationshipId: "rel-1",
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            bondType: "friendship"
        });

        expect(dto.relationshipId).toBe("rel-1");
        expect(dto.bondType).toBe("friendship");

        expect(mockEventBus.publish).toHaveBeenCalled();
        const publishedEvent = (mockEventBus.publish as any).mock.calls[0][0];
        expect(publishedEvent.eventType).toBe("EVT_REL_RelationshipEstablished");
    });

    it("updates metrics and publishes metric changed event", async () => {
        await engine.establishRelationship({
            relationshipId: "rel-1",
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            bondType: "friendship"
        });

        const dto = await engine.updateRelationshipMetrics({
            relationshipId: "rel-1",
            trustDelta: 0.2,
            affinityDelta: 0.1,
            respectDelta: 0.1,
            loyaltyDelta: 0.05,
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: []
        });

        expect(dto.trust).toBeGreaterThan(0.5);
    });

    it("persists relationship across repository reload", async () => {
        await engine.establishRelationship({
            relationshipId: "rel-1",
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            bondType: "friendship"
        });

        const reloaded = await repository.findById("rel-1");
        expect(reloaded).not.toBeNull();
        expect(reloaded!.getRelationshipId()).toBe("rel-1");
    });
});
