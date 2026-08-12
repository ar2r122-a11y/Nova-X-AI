import { describe, it, expect } from "vitest";
import { AudioStreamHandleDto } from "../../../src/Application/DTO/AudioStreamHandleDto";
import { VoiceProfileDto } from "../../../src/Application/DTO/VoiceProfileDto";
import { VoiceSessionDto } from "../../../src/Application/DTO/VoiceSessionDto";
import { AudioStreamDto } from "../../../src/Application/DTO/AudioStreamDto";
import { VoiceSynthesisResultDto } from "../../../src/Application/DTO/VoiceSynthesisResultDto";
import { ProviderHealthDto } from "../../../src/Application/DTO/ProviderHealthDto";
import { AudioCacheDto } from "../../../src/Application/DTO/AudioCacheDto";
import { VoiceProfileSummaryDto } from "../../../src/Application/DTO/VoiceProfileSummaryDto";
import { VoiceBudgetDto } from "../../../src/Application/DTO/VoiceBudgetDto";
import { AudioChunkDto } from "../../../src/Application/DTO/AudioChunkDto";

describe("DtoSerialization", () => {
    describe("AudioStreamHandleDto", () => {
        it("round-trips through fromResult", () => {
            const dto = AudioStreamHandleDto.fromResult({
                streamId: "stream-1",
                requestId: "req-1",
                voiceId: "voice-1",
                providerId: "default",
                profileId: "profile-1",
                status: "synthesizing",
                estimatedDurationMs: 5000,
                correlationId: "corr-1"
            });

            expect(dto.streamId).toBe("stream-1");
            expect(dto.status).toBe("synthesizing");
            expect(dto).toBeInstanceOf(AudioStreamHandleDto);
        });
    });

    describe("VoiceProfileDto", () => {
        it("round-trips from profile", () => {
            const dto = VoiceProfileDto.fromProfile({
                getProfileId: () => ({ getValue: () => "profile-1" }),
                getCharacterId: () => "char-1",
                getVoiceId: () => "voice-1",
                getSpeakingRate: () => 1.2,
                getPitchModifier: () => 0.1,
                getSupportedParameters: () => ["speed"],
                getModelMetadata: () => ({}),
                getProviderCapabilityMetadata: () => ({}),
                getLocale: () => ({ getValue: () => "en-US" }),
                getConfigurationVersion: () => 1,
                getCreatedAt: () => 1000,
                getUpdatedAt: () => 2000
            });

            expect(dto.profileId).toBe("profile-1");
            expect(dto.speakingRate).toBe(1.2);
            expect(dto).toBeInstanceOf(VoiceProfileDto);
        });
    });

    describe("VoiceSessionDto", () => {
        it("round-trips from aggregate", () => {
            const dto = VoiceSessionDto.fromAggregate({
                getSessionId: () => ({ getValue: () => "session-1" }),
                getVoiceId: () => ({ getValue: () => "voice-1" }),
                getProfileId: () => ({ getValue: () => "profile-1" }),
                getSessionState: () => ({ getValue: () => "active" }),
                getStartedAt: () => 1000,
                getEndedAt: () => null,
                getTotalAudioDurationMs: () => 500,
                getText: () => "hello"
            });

            expect(dto.sessionId).toBe("session-1");
            expect(dto.state).toBe("active");
            expect(dto).toBeInstanceOf(VoiceSessionDto);
        });
    });

    describe("AudioStreamDto", () => {
        it("round-trips from aggregate", () => {
            const dto = AudioStreamDto.fromAggregate({
                getStreamId: () => "stream-1",
                getVoiceId: () => "voice-1",
                getRequestId: () => "req-1",
                getProfileId: () => "profile-1",
                getProviderId: () => "default",
                getText: () => "hello",
                getStatus: () => "streaming",
                getChunks: () => [{ getByteLength: () => 1024 }],
                getTotalBytes: () => 1024,
                getCreatedAt: () => 1000,
                getCompletedAt: () => null
            });

            expect(dto.streamId).toBe("stream-1");
            expect(dto.totalChunks).toBe(1);
            expect(dto).toBeInstanceOf(AudioStreamDto);
        });
    });

    describe("VoiceSynthesisResultDto", () => {
        it("round-trips constructor values", () => {
            const dto = new VoiceSynthesisResultDto(
                "req-1", "voice-1", "completed", 5000, 10, "default", 1500, "corr-1"
            );

            expect(dto.requestId).toBe("req-1");
            expect(dto.status).toBe("completed");
            expect(dto).toBeInstanceOf(VoiceSynthesisResultDto);
        });
    });

    describe("ProviderHealthDto", () => {
        it("round-trips constructor values", () => {
            const dto = new ProviderHealthDto("default", "healthy", 120, Date.now(), 0, 100);

            expect(dto.providerId).toBe("default");
            expect(dto.latencyMs).toBe(120);
            expect(dto).toBeInstanceOf(ProviderHealthDto);
        });
    });

    describe("AudioCacheDto", () => {
        it("round-trips constructor values", () => {
            const dto = new AudioCacheDto("voice-1", 5, 10240, Date.now());

            expect(dto.voiceId).toBe("voice-1");
            expect(dto.cachedItems).toBe(5);
            expect(dto).toBeInstanceOf(AudioCacheDto);
        });
    });

    describe("VoiceProfileSummaryDto", () => {
        it("round-trips constructor values", () => {
            const dto = new VoiceProfileSummaryDto(
                "profile-1", "char-1", "voice-1", "en-US", 1.0, 1
            );

            expect(dto.profileId).toBe("profile-1");
            expect(dto.locale).toBe("en-US");
            expect(dto).toBeInstanceOf(VoiceProfileSummaryDto);
        });
    });

    describe("VoiceBudgetDto", () => {
        it("round-trips constructor values", () => {
            const dto = new VoiceBudgetDto(
                "voice-1", 100, 300, 4096, 128, 1000, 1024, 50, 2048, 64
            );

            expect(dto.voiceId).toBe("voice-1");
            expect(dto.hardLatencyMs).toBe(100);
            expect(dto).toBeInstanceOf(VoiceBudgetDto);
        });
    });

    describe("AudioChunkDto", () => {
        it("round-trips constructor values", () => {
            const dto = new AudioChunkDto(1, 1024, "pcm", Date.now());

            expect(dto.sequence).toBe(1);
            expect(dto.chunkSizeBytes).toBe(1024);
            expect(dto).toBeInstanceOf(AudioChunkDto);
        });
    });
});
