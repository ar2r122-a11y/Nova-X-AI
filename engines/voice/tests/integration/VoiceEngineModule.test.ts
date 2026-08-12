import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import { VoiceProfileSummaryDto } from "../../src/Application/DTO/VoiceProfileSummaryDto";
import { AudioStreamHandleDto } from "../../src/Application/DTO/AudioStreamHandleDto";
import { VoiceSynthesisResultDto } from "../../src/Application/DTO/VoiceSynthesisResultDto";
import { ProviderHealthDto } from "../../src/Application/DTO/ProviderHealthDto";
import { AudioCacheDto } from "../../src/Application/DTO/AudioCacheDto";
import { VoiceProfileCreatedEvent } from "../../src/Domain/Events";

describe("VoiceEngineModule", () => {
    let mockEventBus: any;
    let mockVoiceRepo: any;
    let mockProfileRepo: any;
    let mockSessionRepo: any;
    let mockEventStoreRepo: any;
    let mockScheduledRepo: any;
    let mockTimeService: any;
    let mockCompressionService: any;
    let mockCacheService: any;
    let mockMultiSpeaker: any;
    let engine: VoiceEngine;

    beforeEach(() => {
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined)
        };
        mockVoiceRepo = {
            findById: vi.fn(),
            save: vi.fn()
        };
        mockProfileRepo = {
            findById: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
            findByCharacterId: vi.fn(),
            findAll: vi.fn()
        };
        mockSessionRepo = {
            findById: vi.fn(),
            save: vi.fn()
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

    describe("initialize", () => {
        it("creates new voice when not found and publishes events", async () => {
            mockVoiceRepo.findById.mockResolvedValue(null);

            await engine.initialize("voice-1");

            expect(mockVoiceRepo.save).toHaveBeenCalled();
            expect(mockEventBus.publish).toHaveBeenCalled();
            const publishedEvent = mockEventBus.publish.mock.calls[0][0];
            expect(publishedEvent.eventType).toBe("EVT_VOICE_VoiceInitialized");
        });

        it("does nothing when voice already exists", async () => {
            mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));

            await engine.initialize("voice-1");

            expect(mockVoiceRepo.save).not.toHaveBeenCalled();
        });
    });

    describe("synthesizeSpeech", () => {
        it("publishes synthesis events", async () => {
            mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
            const result = await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

            expect(result).toBeInstanceOf(AudioStreamHandleDto);
            expect(mockEventBus.publish).toHaveBeenCalled();
        });

        it("throws when voice not found", async () => {
            mockVoiceRepo.findById.mockResolvedValue(null);

            const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
            await expect(engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1"))).rejects.toThrow();
        });
    });

    describe("createVoiceProfile", () => {
        it("saves profile and publishes VoiceProfileCreatedEvent", async () => {
            await engine.createVoiceProfile({
                characterId: "char-1",
                voiceId: "voice-1",
                locale: "en-US",
                correlationId: "c1",
                causationId: "ca1",
                claims: { roles: ["user"], permissions: ["write"] }
            } as any);

            expect(mockProfileRepo.save).toHaveBeenCalled();
            expect(mockEventBus.publish).toHaveBeenCalledWith(expect.any(VoiceProfileCreatedEvent));
        });
    });

    describe("shutdown", () => {
        it("clears active streams", async () => {
            mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
            await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1"));
            await engine.shutdown();
        });
    });
});
