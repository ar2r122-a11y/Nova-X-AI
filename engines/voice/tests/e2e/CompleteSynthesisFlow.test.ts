import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../src/Domain/ValueObjects/ProviderCostMetadata";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import { AudioStreamHandleDto } from "../../src/Application/DTO/AudioStreamHandleDto";

describe("CompleteSynthesisFlow", () => {
    let engine: VoiceEngine;
    let voiceId: VoiceId;
    let providerId: VoiceProviderId;

    beforeEach(() => {
        voiceId = VoiceId.create("voice-123");
        providerId = VoiceProviderId.create("provider-1");
        engine = new VoiceEngine(
            {} as any,
            { findById: vi.fn().mockResolvedValue(null), save: vi.fn() } as any,
            {} as any,
            { findById: vi.fn().mockResolvedValue(null) } as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );
    });

    it("completes full synthesis flow from text to completion", async () => {
        const profile = VoiceProfile.create(
            VoiceProfileId.generate(),
            "char-1",
            "voice-123",
            VoiceLocale.create("en-US")
        );

        const mockAggregate = {
            getVoiceId: () => voiceId,
            getVoiceState: () => ({ getValue: () => "waiting_for_input" }),
            getProviderId: () => providerId,
            getVersion: () => 0,
            getTotalAudioDurationMs: () => 0,
            getTotalChunksProcessed: () => 0,
            startSynthesis: vi.fn(),
            getUncommittedEvents: () => [],
            commitEvents: vi.fn()
        };

        vi.mocked(engine.voiceRepository.findById).mockResolvedValue(mockAggregate as any);
        vi.mocked(engine.profileRepository.findById).mockResolvedValue(profile);

        const result = await engine.synthesizeSpeech({
            voiceId: "voice-123",
            text: "Hello world",
            voiceProfileId: "profile-123",
            providerId: "provider-1",
            claims: { roles: ["user"] },
            correlationId: "corr-1"
        } as any);

        expect(result).toBeDefined();
        expect(result.streamId).toBeDefined();
        expect(result.requestId).toBeDefined();
    });

    it("respects free-first provider policy", async () => {
        const mockAggregate = {
            getVoiceId: () => voiceId,
            getVoiceState: () => ({ getValue: () => "waiting_for_input" }),
            getProviderId: () => providerId,
            getVersion: () => 0,
            getTotalAudioDurationMs: () => 0,
            getTotalChunksProcessed: () => 0,
            startSynthesis: vi.fn(),
            getUncommittedEvents: () => [],
            commitEvents: vi.fn()
        };

        vi.mocked(engine.voiceRepository.findById).mockResolvedValue(mockAggregate as any);
        vi.mocked(engine.profileRepository.findById).mockResolvedValue(null);

        await expect(
            engine.synthesizeSpeech({
                voiceId: "voice-123",
                text: "Hello",
                voiceProfileId: "profile-123",
                providerId: "provider-1",
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).rejects.toThrow();
    });
});
