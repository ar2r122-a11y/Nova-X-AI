import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";

describe("AiRouterBoundary (Integration)", () => {
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

    it("VoiceEngine delegates provider selection to aggregate state machine, not vendor SDKs", async () => {
        mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
        mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

        const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
        const result = await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

        expect(result).toBeDefined();
        expect(mockVoiceRepo.save).toHaveBeenCalled();
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it("VoiceEngine does not contain direct vendor client imports", () => {
        const fs = require("fs");
        const path = require("path");
        const sourcePath = path.resolve(__dirname, "../../src/Infrastructure/VoiceEngine.ts");
        const content = fs.readFileSync(sourcePath, "utf-8");

        expect(content).not.toContain("openai");
        expect(content).not.toContain("elevenlabs");
        expect(content).not.toContain("azure-cognitiveservices");
        expect(content).not.toContain("@google-cloud");
    });

    it("provider routing uses VoiceProviderId value object only", async () => {
        mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("provider-x")));
        mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

        const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
        await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "provider-x", "c1", "ca1"));

        const savedAggregate = mockVoiceRepo.save.mock.calls[0][0];
        expect(savedAggregate.getProviderId().getValue()).toBe("provider-x");
    });
});
