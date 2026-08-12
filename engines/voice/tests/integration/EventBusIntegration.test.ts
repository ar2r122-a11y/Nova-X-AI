import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import { VoiceProfileCreatedEvent, VoiceProfileUpdatedEvent, VoiceProfileDeletedEvent, VoiceSynthesisStartedEvent, VoiceStreamInterruptedEvent } from "../../src/Domain/Events";

describe("EventBusIntegration", () => {
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
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined)
        };
        mockVoiceRepo = {
            findById: vi.fn(),
            save: vi.fn()
        };
        mockSessionRepo = {
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
        it("publishes VoiceInitializedEvent", async () => {
            mockVoiceRepo.findById.mockResolvedValue(null);

            await engine.initialize("voice-1");

            expect(mockEventBus.publish).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventType: "EVT_VOICE_VoiceInitialized"
                })
            );
        });
    });

    describe("synthesizeSpeech", () => {
        it("publishes VoiceSynthesisStartedEvent", async () => {
            mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
            await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

            expect(mockEventBus.publish).toHaveBeenCalledWith(
                expect.objectContaining({
                    eventType: "EVT_VOICE_SynthesisStarted"
                })
            );
        });
    });

    describe("interrupt", () => {
        it("publishes VoiceStreamInterruptedEvent and recovery events", async () => {
            const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));
            aggregate.startSynthesis("req-1", VoiceProviderId.create("default"));
            aggregate.transitionToStreaming();
            mockVoiceRepo.findById.mockResolvedValue(aggregate);

            const { InterruptCommand } = await import("../../src/Application/Commands/InterruptCommand");
            await engine.interrupt(new InterruptCommand("voice-1", "req-1", "timeout", "c1", "ca1"));

            const calls = mockEventBus.publish.mock.calls.map((c: any[]) => c[0]);
            const eventTypes = calls.map((e: any) => e.eventType);
            expect(eventTypes).toContain("EVT_VOICE_StreamInterrupted");
        });
    });

    describe("createVoiceProfile", () => {
        it("publishes VoiceProfileCreatedEvent", async () => {
            await engine.createVoiceProfile({
                characterId: "char-1",
                voiceId: "voice-1",
                locale: "en-US",
                correlationId: "c1",
                causationId: "ca1",
                claims: { roles: ["user"], permissions: ["write"] }
            } as any);

            expect(mockEventBus.publish).toHaveBeenCalledWith(
                expect.any(VoiceProfileCreatedEvent)
            );
        });
    });

    describe("updateVoiceProfile", () => {
        it("publishes VoiceProfileUpdatedEvent", async () => {
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { UpdateVoiceProfileCommand } = await import("../../src/Application/Commands/UpdateVoiceProfileCommand");
            await engine.updateVoiceProfile(new UpdateVoiceProfileCommand("profile-1", 1.1, undefined, undefined, undefined, undefined, "c1", "ca1"));

            expect(mockEventBus.publish).toHaveBeenCalledWith(
                expect.any(VoiceProfileUpdatedEvent)
            );
        });
    });

    describe("deleteVoiceProfile", () => {
        it("publishes VoiceProfileDeletedEvent", async () => {
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { DeleteVoiceProfileCommand } = await import("../../src/Application/Commands/DeleteVoiceProfileCommand");
            await engine.deleteVoiceProfile(new DeleteVoiceProfileCommand("profile-1", "c1", "ca1"));

            expect(mockEventBus.publish).toHaveBeenCalledWith(
                expect.any(VoiceProfileDeletedEvent)
            );
        });
    });
});
