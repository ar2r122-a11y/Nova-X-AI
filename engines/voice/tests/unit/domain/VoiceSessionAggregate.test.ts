import { describe, it, expect, beforeEach } from "vitest";
import { VoiceSessionAggregate } from "../../../src/Domain/Aggregates/VoiceSessionAggregate";
import { VoiceSessionId } from "../../../src/Domain/ValueObjects/VoiceSessionId";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";

describe("VoiceSessionAggregate", () => {
    let sessionId: VoiceSessionId;
    let voiceId: VoiceId;
    let profileId: VoiceProfileId;

    beforeEach(() => {
        sessionId = VoiceSessionId.create("session-123");
        voiceId = VoiceId.create("voice-123");
        profileId = VoiceProfileId.create("profile-123");
    });

    describe("create", () => {
        it("creates a new session in active state", () => {
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "Hello world");
            expect(aggregate.getSessionId().getValue()).toBe("session-123");
            expect(aggregate.getVoiceId().getValue()).toBe("voice-123");
            expect(aggregate.getProfileId().getValue()).toBe("profile-123");
            expect(aggregate.getSessionState().getValue()).toBe("active");
            expect(aggregate.getText()).toBe("Hello world");
            expect(aggregate.getTotalAudioDurationMs()).toBe(0);
        });

        it("emits VoiceSessionCreatedEvent on creation", () => {
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "Hello");
            const events = aggregate.getUncommittedEvents();
            expect(events).toHaveLength(1);
            expect(events[0].eventType).toBe("EVT_VOICE_SessionCreated");
        });
    });

    describe("reconstitute", () => {
        it("reconstitutes a session from persisted state", () => {
            const aggregate = VoiceSessionAggregate.reconstitute(
                sessionId,
                voiceId,
                profileId,
                { getValue: () => "completed" } as any,
                3,
                Date.now() - 10000,
                Date.now(),
                5000,
                "Hello"
            );
            expect(aggregate.getSessionState().getValue()).toBe("completed");
            expect(aggregate.getTotalAudioDurationMs()).toBe(5000);
        });
    });

    describe("session lifecycle", () => {
        it("completes a session", () => {
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "Hello");
            aggregate.complete(3000);
            expect(aggregate.getSessionState().getValue()).toBe("completed");
            expect(aggregate.getEndedAt()).not.toBeNull();
            expect(aggregate.getTotalAudioDurationMs()).toBe(3000);
            const events = aggregate.getUncommittedEvents();
            expect(events[events.length - 1].eventType).toBe("EVT_VOICE_SessionCompleted");
        });

        it("fails a session", () => {
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "Hello");
            aggregate.fail("synthesis_error");
            expect(aggregate.getSessionState().getValue()).toBe("failed");
            const events = aggregate.getUncommittedEvents();
            expect(events[events.length - 1].eventType).toBe("EVT_VOICE_SessionFailed");
        });
    });

    describe("commitEvents", () => {
        it("clears uncommitted events after commit", () => {
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "Hello");
            expect(aggregate.getUncommittedEvents()).toHaveLength(1);
            aggregate.commitEvents();
            expect(aggregate.getUncommittedEvents()).toHaveLength(0);
        });
    });
});
