import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { EmotionEngine } from "../../src/Infrastructure/EmotionEngine";
import { EmotionRepositoryImpl } from "../../src/Infrastructure/Persistence/EmotionRepositoryImpl";

describe("test_emotion_engine_with_character_sensitivity", () => {
    let mockEventBus: IEventBus;
    let mockStorage: IStorageEngine;
    let repository: EmotionRepositoryImpl;
    let engine: EmotionEngine;

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

        repository = new EmotionRepositoryImpl(mockStorage);
        engine = new EmotionEngine(mockEventBus, repository);
    });

    it("processes stimulus and updates emotional state", async () => {
        const dto = await engine.processStimulus("char-1", {
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.9,
            valence: 0.9
        }, 1.0);
        expect(dto.characterId).toBe("char-1");
        expect(dto.primaryEmotion).not.toBe("neutral");
    });

    it("returns emotional state for existing character", async () => {
        await engine.processStimulus("char-1", {
            sourceId: "test",
            stimulusType: "dialogue",
            intensity: 0.9,
            valence: 0.9
        }, 1.0);
        const dto = await engine.getEmotionalState("char-1");
        expect(dto.characterId).toBe("char-1");
    });

    it("throws EmotionNotFoundException for unknown character", async () => {
        await expect(engine.getEmotionalState("unknown")).rejects.toThrow();
    });
});
