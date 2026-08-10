import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { EmotionEngine } from "../src/Infrastructure/EmotionEngine";
import { EmotionRepositoryImpl } from "../src/Infrastructure/Persistence/EmotionRepositoryImpl";

describe("test_full_stimulus_to_ai_prompt_emotional_flow", () => {
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

    it("verifies stimulus -> emotion processing -> emotional state change -> emotional context -> AI prompt context", async () => {
        const snapshot = await engine.processStimulus("char-1", {
            sourceId: "dialogue-user",
            stimulusType: "dialogue",
            intensity: 0.9,
            valence: 0.9
        }, 1.0);

        expect(snapshot.characterId).toBe("char-1");
        expect(snapshot.primaryEmotion).not.toBe("neutral");

        const context = await engine.getEmotionalContext("char-1");
        expect(context.characterId).toBe("char-1");
        expect(context.promptContext).toContain("Current Emotion");
        expect(context.promptContext).toContain("PAD");

        expect(mockEventBus.publish).toHaveBeenCalled();
        const publishedEvent = (mockEventBus.publish as any).mock.calls[0][0];
        expect(["EVT_EMOT_EmotionalStateChanged", "EVT_EMOT_MoodShifted"]).toContain(publishedEvent.eventType);
    });
});
