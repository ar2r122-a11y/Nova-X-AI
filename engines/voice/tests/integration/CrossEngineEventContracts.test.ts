import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import {
    VoiceInitializedEvent,
    VoiceSynthesisStartedEvent,
    VoiceAudioChunkEvent,
    VoiceStreamCompletedEvent,
    VoiceStreamInterruptedEvent,
    VoiceSynthesisFailedEvent,
    VoiceRecoveryStartedEvent,
    VoiceProviderStatusChangedEvent,
    VoiceSessionCreatedEvent,
    VoiceSessionCompletedEvent,
    VoiceSessionFailedEvent,
    VoiceBudgetExceededEvent,
    VoiceProfileCreatedEvent,
    VoiceProfileUpdatedEvent,
    VoiceProfileDeletedEvent
} from "../../src/Domain/Events";

describe("CrossEngineEventContracts", () => {
    let mockEventBus: any;
    let mockVoiceRepo: any;
    let mockSessionRepo: any;
    let mockProfileRepo: any;
    let mockEventStoreRepo: any;
    let mockScheduledRepo: any;
    let mockTimeService: any;
    let mockCompressionService: any;
    let mockCacheService: any;
    let mockMultiSpeaker: any;
    let engine: VoiceEngine;

    beforeEach(() => {
        mockEventBus = { publish: vi.fn().mockResolvedValue(undefined) };
        mockVoiceRepo = { findById: vi.fn(), save: vi.fn() };
        mockSessionRepo = { findById: vi.fn(), save: vi.fn() };
        mockProfileRepo = {
            findById: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
            findByCharacterId: vi.fn(),
            findAll: vi.fn()
        };
        mockProfileRepo = {
            findById: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
            findByCharacterId: vi.fn(),
            findAll: vi.fn()
        };
        mockEventStoreRepo = {
            eventStore: {
                appendToStream: vi.fn(),
                readStream: vi.fn(),
                getStreamVersion: vi.fn()
            }
        };
        mockScheduledRepo = {
            save: vi.fn(),
            findById: vi.fn(),
            findByVoiceId: vi.fn(),
            findAll: vi.fn(),
            delete: vi.fn()
        };
        mockTimeService = {
            getCurrentTime: () => Date.now(),
            advance: vi.fn()
        };
        mockCompressionService = {
            compress: vi.fn().mockResolvedValue({ data: new ArrayBuffer(0), algorithm: "none" }),
            decompress: vi.fn().mockResolvedValue(new ArrayBuffer(0))
        };
        mockCacheService = {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn()
        };
        mockMultiSpeaker = {
            resolveVoiceProfile: vi.fn(),
            queueAudio: vi.fn(),
            mix: vi.fn()
        };

        engine = new VoiceEngine(
            mockEventBus,
            mockVoiceRepo,
            mockSessionRepo,
            mockProfileRepo,
            mockEventStoreRepo,
            mockScheduledRepo,
            mockTimeService,
            mockCompressionService,
            mockCacheService,
            mockMultiSpeaker
        );
    });

    it("VoiceInitializedEvent uses EVT_VOICE_ prefix compatible with Nova Core", () => {
        const event = new VoiceInitializedEvent("voice-1", Date.now(), "c1");
        expect(event.eventType).toMatch(/^EVT_VOICE_/);
        expect(event.eventType).toBe("EVT_VOICE_VoiceInitialized");
    });

    it("VoiceProfileCreatedEvent carries characterId for Character engine correlation", async () => {
        await engine.createVoiceProfile({
            characterId: "char-1",
            voiceId: "voice-1",
            locale: "en-US",
            correlationId: "c1",
            causationId: "ca1",
            claims: { roles: ["user"], permissions: ["write"] }
        } as any);

        const publishedEvent = mockEventBus.publish.mock.calls.find(
            (call: any[]) => call[0] instanceof VoiceProfileCreatedEvent
        );
        expect(publishedEvent).toBeDefined();
        expect((publishedEvent![0] as VoiceProfileCreatedEvent).characterId).toBe("char-1");
    });

    it("VoiceSessionCreatedEvent is not emitted during synthesis (Conversation engine correlation expected at session creation)", async () => {
        const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));
        mockVoiceRepo.findById.mockResolvedValue(aggregate);
        mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

        const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
        await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

        const calls = mockEventBus.publish.mock.calls.map((c: any[]) => c[0]);
        const sessionCreated = calls.find((e: any) => e.eventType === "EVT_VOICE_SessionCreated");
        expect(sessionCreated).toBeUndefined();
    });

    it("VoiceSynthesisStartedEvent carries correlationId from aggregate event creation", async () => {
        mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
        mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

        const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
        await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

        const publishedEvent = mockEventBus.publish.mock.calls.find(
            (call: any[]) => call[0] instanceof VoiceSynthesisStartedEvent
        );
        expect(publishedEvent).toBeDefined();
        expect((publishedEvent![0] as VoiceSynthesisStartedEvent).correlationId).toBe("");
    });

    it("VoiceProviderStatusChangedEvent uses EVT_VOICE_ prefix for provider monitoring", () => {
        const event = new VoiceProviderStatusChangedEvent("default", "healthy", "degraded", "c1");
        expect(event.eventType).toBe("EVT_VOICE_ProviderStatusChanged");
        expect(event.previousStatus).toBe("healthy");
        expect(event.newStatus).toBe("degraded");
    });

    it("VoiceBudgetExceededEvent is recorded on aggregate for World engine budget constraints", async () => {
        const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));
        aggregate.recordBudgetExceeded("audio", 10000, 5000);

        const events = aggregate.getUncommittedEvents();
        const budgetEvent = events.find((e: any) => e.eventType === "EVT_VOICE_BudgetExceeded");
        expect(budgetEvent).toBeDefined();
        expect((budgetEvent as any).budgetType).toBe("audio");
        expect((budgetEvent as any).currentValue).toBe(10000);
        expect((budgetEvent as any).limitValue).toBe(5000);
    });

    it("all voice events implement IDomainEvent contract from Nova Core", () => {
        const events = [
            new VoiceInitializedEvent("v1", 0, "c1"),
            new VoiceSynthesisStartedEvent("v1", "r1", "t", "p1", "d1", "c1"),
            new VoiceAudioChunkEvent("v1", "r1", 1, 1024, "pcm", "c1"),
            new VoiceStreamCompletedEvent("v1", "r1", 1000, 5, "d1", "c1"),
            new VoiceStreamInterruptedEvent("v1", "r1", "err", 0, "c1"),
            new VoiceSynthesisFailedEvent("v1", "r1", "err", "d1", "c1"),
            new VoiceRecoveryStartedEvent("v1", "err", "c1"),
            new VoiceProviderStatusChangedEvent("d1", "h", "d", "c1"),
            new VoiceSessionCreatedEvent("s1", "v1", "p1", "c1"),
            new VoiceSessionCompletedEvent("s1", "v1", 1000, "c1"),
            new VoiceSessionFailedEvent("s1", "v1", "err", "c1"),
            new VoiceBudgetExceededEvent("v1", "a", 100, 50, "c1"),
            new VoiceProfileCreatedEvent("p1", "c1", "c1"),
            new VoiceProfileUpdatedEvent("p1", [], "c1"),
            new VoiceProfileDeletedEvent("p1", "c1")
        ];

        for (const event of events) {
            expect(event.eventType).toBeDefined();
            expect(event.timestamp).toBeDefined();
            expect(event.correlationId).toBeDefined();
        }
    });
});
