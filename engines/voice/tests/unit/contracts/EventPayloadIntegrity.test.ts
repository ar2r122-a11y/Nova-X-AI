import { describe, it, expect } from "vitest";
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
} from "../../../src/Domain/Events";

describe("EventPayloadIntegrity", () => {
    it("VoiceInitializedEvent has eventType, voiceId, timestamp, correlationId", () => {
        const event = new VoiceInitializedEvent("voice-1", Date.now(), "c1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceInitialized");
        expect(event.voiceId).toBe("voice-1");
        expect(event.timestamp).toBeDefined();
        expect(event.correlationId).toBe("c1");
    });

    it("VoiceSynthesisStartedEvent has required fields", () => {
        const event = new VoiceSynthesisStartedEvent("voice-1", "req-1", "text", "profile-1", "default", "c1");
        expect(event.eventType).toBe("EVT_VOICE_SynthesisStarted");
        expect(event.voiceId).toBe("voice-1");
        expect(event.requestId).toBe("req-1");
        expect(event.text).toBe("text");
        expect(event.providerId).toBe("default");
    });

    it("VoiceAudioChunkEvent has required fields", () => {
        const event = new VoiceAudioChunkEvent("voice-1", "req-1", 1, 1024, "pcm", "c1");
        expect(event.eventType).toBe("EVT_VOICE_AudioChunk");
        expect(event.sequence).toBe(1);
        expect(event.chunkSizeBytes).toBe(1024);
        expect(event.codec).toBe("pcm");
    });

    it("VoiceStreamCompletedEvent has required fields", () => {
        const event = new VoiceStreamCompletedEvent("voice-1", "req-1", 5000, 10, "default", "c1");
        expect(event.eventType).toBe("EVT_VOICE_StreamCompleted");
        expect(event.durationMs).toBe(5000);
        expect(event.totalChunks).toBe(10);
    });

    it("VoiceStreamInterruptedEvent has required fields", () => {
        const event = new VoiceStreamInterruptedEvent("voice-1", "req-1", "timeout", 0, "c1");
        expect(event.eventType).toBe("EVT_VOICE_StreamInterrupted");
        expect(event.reason).toBe("timeout");
    });

    it("VoiceSynthesisFailedEvent has required fields", () => {
        const event = new VoiceSynthesisFailedEvent("voice-1", "req-1", "error", "default", "c1");
        expect(event.eventType).toBe("EVT_VOICE_SynthesisFailed");
        expect(event.reason).toBe("error");
    });

    it("VoiceRecoveryStartedEvent has required fields", () => {
        const event = new VoiceRecoveryStartedEvent("voice-1", "max_retries_exceeded", "c1");
        expect(event.eventType).toBe("EVT_VOICE_RecoveryStarted");
        expect(event.reason).toBe("max_retries_exceeded");
    });

    it("VoiceProviderStatusChangedEvent has required fields", () => {
        const event = new VoiceProviderStatusChangedEvent("default", "healthy", "degraded", "c1");
        expect(event.eventType).toBe("EVT_VOICE_ProviderStatusChanged");
        expect(event.providerId).toBe("default");
        expect(event.previousStatus).toBe("healthy");
        expect(event.newStatus).toBe("degraded");
    });

    it("VoiceSessionCreatedEvent has required fields", () => {
        const event = new VoiceSessionCreatedEvent("session-1", "voice-1", "profile-1", "c1");
        expect(event.eventType).toBe("EVT_VOICE_SessionCreated");
        expect(event.sessionId).toBe("session-1");
    });

    it("VoiceSessionCompletedEvent has required fields", () => {
        const event = new VoiceSessionCompletedEvent("session-1", "voice-1", 3000, "c1");
        expect(event.eventType).toBe("EVT_VOICE_SessionCompleted");
        expect(event.durationMs).toBe(3000);
    });

    it("VoiceSessionFailedEvent has required fields", () => {
        const event = new VoiceSessionFailedEvent("session-1", "voice-1", "network error", "c1");
        expect(event.eventType).toBe("EVT_VOICE_SessionFailed");
        expect(event.reason).toBe("network error");
    });

    it("VoiceBudgetExceededEvent has required fields", () => {
        const event = new VoiceBudgetExceededEvent("voice-1", "audio", 10000, 5000, "c1");
        expect(event.eventType).toBe("EVT_VOICE_BudgetExceeded");
        expect(event.budgetType).toBe("audio");
        expect(event.currentValue).toBe(10000);
        expect(event.limitValue).toBe(5000);
    });

    it("VoiceProfileCreatedEvent has required fields", () => {
        const event = new VoiceProfileCreatedEvent("profile-1", "char-1", "c1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceProfileCreated");
        expect(event.profileId).toBe("profile-1");
    });

    it("VoiceProfileUpdatedEvent has required fields", () => {
        const event = new VoiceProfileUpdatedEvent("profile-1", ["speakingRate"], "c1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceProfileUpdated");
        expect(event.updatedFields).toContain("speakingRate");
    });

    it("VoiceProfileDeletedEvent has required fields", () => {
        const event = new VoiceProfileDeletedEvent("profile-1", "c1");
        expect(event.eventType).toBe("EVT_VOICE_VoiceProfileDeleted");
        expect(event.profileId).toBe("profile-1");
    });

    it("all events implement IDomainEvent", () => {
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
