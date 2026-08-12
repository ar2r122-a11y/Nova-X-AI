import { describe, it, expect } from "vitest";
import type { VoiceReadModel, VoiceSessionReadModel, ProviderHealthReadModel } from "../../../src/Application/Projections/VoiceReadModel";

describe("VoiceReadModel", () => {
    it("VoiceReadModel has required properties", () => {
        const readModel: VoiceReadModel = {
            voiceId: "voice-1",
            voiceState: "streaming",
            providerId: "provider-1",
            version: 1,
            lastRequestId: "req-1",
            totalAudioDurationMs: 5000,
            totalChunksProcessed: 10,
            consecutiveFailures: 0,
            updatedAt: 1700000000000
        };
        expect(readModel.voiceId).toBe("voice-1");
        expect(readModel.voiceState).toBe("streaming");
        expect(readModel.providerId).toBe("provider-1");
        expect(readModel.version).toBe(1);
        expect(readModel.lastRequestId).toBe("req-1");
        expect(readModel.totalAudioDurationMs).toBe(5000);
        expect(readModel.totalChunksProcessed).toBe(10);
        expect(readModel.consecutiveFailures).toBe(0);
        expect(readModel.updatedAt).toBe(1700000000000);
    });

    it("VoiceReadModel accepts null lastRequestId", () => {
        const readModel: VoiceReadModel = {
            voiceId: "voice-1",
            voiceState: "idle",
            providerId: "provider-1",
            version: 0,
            lastRequestId: null,
            totalAudioDurationMs: 0,
            totalChunksProcessed: 0,
            consecutiveFailures: 0,
            updatedAt: 1700000000000
        };
        expect(readModel.lastRequestId).toBeNull();
    });

    it("VoiceSessionReadModel has required properties", () => {
        const readModel: VoiceSessionReadModel = {
            sessionId: "session-1",
            voiceId: "voice-1",
            profileId: "profile-1",
            sessionState: "active",
            startedAt: 1700000000000,
            endedAt: null,
            totalAudioDurationMs: 5000,
            text: "Hello world",
            updatedAt: 1700000000000
        };
        expect(readModel.sessionId).toBe("session-1");
        expect(readModel.voiceId).toBe("voice-1");
        expect(readModel.profileId).toBe("profile-1");
        expect(readModel.sessionState).toBe("active");
        expect(readModel.startedAt).toBe(1700000000000);
        expect(readModel.endedAt).toBeNull();
        expect(readModel.totalAudioDurationMs).toBe(5000);
        expect(readModel.text).toBe("Hello world");
        expect(readModel.updatedAt).toBe(1700000000000);
    });

    it("VoiceSessionReadModel accepts endedAt number", () => {
        const readModel: VoiceSessionReadModel = {
            sessionId: "session-1",
            voiceId: "voice-1",
            profileId: "profile-1",
            sessionState: "completed",
            startedAt: 1700000000000,
            endedAt: 1700000005000,
            totalAudioDurationMs: 5000,
            text: "Hello world",
            updatedAt: 1700000005000
        };
        expect(readModel.endedAt).toBe(1700000005000);
    });

    it("ProviderHealthReadModel has required properties", () => {
        const readModel: ProviderHealthReadModel = {
            providerId: "provider-1",
            status: "healthy",
            latencyMs: 120,
            lastChecked: 1700000000000,
            errorCount: 2,
            successCount: 98
        };
        expect(readModel.providerId).toBe("provider-1");
        expect(readModel.status).toBe("healthy");
        expect(readModel.latencyMs).toBe(120);
        expect(readModel.lastChecked).toBe(1700000000000);
        expect(readModel.errorCount).toBe(2);
        expect(readModel.successCount).toBe(98);
    });

    it("ProviderHealthReadModel accepts zero values", () => {
        const readModel: ProviderHealthReadModel = {
            providerId: "provider-1",
            status: "unhealthy",
            latencyMs: 0,
            lastChecked: 1700000000000,
            errorCount: 0,
            successCount: 0
        };
        expect(readModel.latencyMs).toBe(0);
        expect(readModel.errorCount).toBe(0);
        expect(readModel.successCount).toBe(0);
    });
});
