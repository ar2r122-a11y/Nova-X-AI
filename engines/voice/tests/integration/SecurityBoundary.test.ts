import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import { VoiceEngineSecurity } from "../../src/Infrastructure/Integration/VoiceEngineSecurity";

describe("SecurityBoundary (Integration)", () => {
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

    describe("text sanitization", () => {
        it("VoiceEngineSecurity strips angle brackets from input", () => {
            const security = new VoiceEngineSecurity();
            expect(security.sanitizeText("<script>alert('xss')</script>")).not.toContain("<");
            expect(security.sanitizeText("<script>alert('xss')</script>")).not.toContain(">");
        });

        it("VoiceEngineSecurity trims whitespace", () => {
            const security = new VoiceEngineSecurity();
            expect(security.sanitizeText("  hello  ")).toBe("hello");
        });

        it("VoiceEngineSecurity passes clean text through", () => {
            const security = new VoiceEngineSecurity();
            expect(security.sanitizeText("hello world")).toBe("hello world");
        });
    });

    describe("access validation", () => {
        it("VoiceEngineSecurity returns true for valid claims", () => {
            const security = new VoiceEngineSecurity();
            expect(security.validateVoiceAccess("voice-1", { roles: ["user"], permissions: ["read"] })).toBe(true);
        });

        it("VoiceEngineSecurity handles empty claims gracefully", () => {
            const security = new VoiceEngineSecurity();
            expect(security.validateVoiceAccess("voice-1", { roles: [], permissions: [] })).toBe(true);
        });
    });

    describe("voice engine respects security boundary", () => {
        it("does not expose raw provider secrets in DTOs", async () => {
            mockVoiceRepo.findById.mockResolvedValue(VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default")));
            mockProfileRepo.findById.mockResolvedValue(VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US")));

            const { SynthesizeSpeechCommand } = await import("../../src/Application/Commands/SynthesizeSpeechCommand");
            const result = await engine.synthesizeSpeech(new SynthesizeSpeechCommand("voice-1", "hello", "profile-1", "default", "c1", "ca1"));

            const json = JSON.stringify(result);
            expect(json).not.toContain("apiKey");
            expect(json).not.toContain("secret");
            expect(json).not.toContain("token");
        });

        it("VoiceEngineSecurity exists in infrastructure layer", () => {
            expect(VoiceEngineSecurity).toBeDefined();
            expect(typeof VoiceEngineSecurity.prototype.sanitizeText).toBe("function");
        });
    });
});
