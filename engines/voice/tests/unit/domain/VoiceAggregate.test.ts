import { describe, it, expect, beforeEach } from "vitest";
import { VoiceAggregate } from "../../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../../src/Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../../src/Domain/ValueObjects/ProviderCostMetadata";
import { VoiceStateRef } from "../../../src/Domain/ValueObjects/VoiceState";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";

describe("VoiceAggregate", () => {
    let voiceId: VoiceId;
    let providerId: VoiceProviderId;

    beforeEach(() => {
        voiceId = VoiceId.create("voice-123");
        providerId = VoiceProviderId.create("provider-1");
    });

    describe("create", () => {
        it("creates a new aggregate in waiting_for_input state", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            expect(aggregate.getVoiceId().getValue()).toBe("voice-123");
            expect(aggregate.getVoiceState().getValue()).toBe("waiting_for_input");
            expect(aggregate.getProviderId().getValue()).toBe("provider-1");
            expect(aggregate.getVersion()).toBe(0);
            expect(aggregate.getTotalAudioDurationMs()).toBe(0);
            expect(aggregate.getTotalChunksProcessed()).toBe(0);
            expect(aggregate.getConsecutiveFailures()).toBe(0);
        });

        it("emits VoiceInitializedEvent on creation", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            const events = aggregate.getUncommittedEvents();
            expect(events).toHaveLength(1);
            expect(events[0].eventType).toBe("EVT_VOICE_VoiceInitialized");
        });
    });

    describe("reconstitute", () => {
        it("reconstitutes an aggregate from persisted state", () => {
            const aggregate = VoiceAggregate.reconstitute(
                voiceId,
                VoiceStateRef.synthesizing(),
                providerId,
                5,
                1200,
                15,
                ProviderCostMetadata.free("provider-1"),
                2
            );
            expect(aggregate.getVersion()).toBe(5);
            expect(aggregate.getTotalAudioDurationMs()).toBe(1200);
            expect(aggregate.getTotalChunksProcessed()).toBe(15);
            expect(aggregate.getConsecutiveFailures()).toBe(2);
        });
    });

    describe("state transitions", () => {
        it("transitions from waiting_for_input to synthesizing", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            expect(aggregate.getVoiceState().getValue()).toBe("synthesizing");
            expect(aggregate.getVersion()).toBe(1);
        });

        it("transitions from synthesizing to streaming_audio", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.transitionToStreaming();
            expect(aggregate.getVoiceState().getValue()).toBe("streaming_audio");
        });

        it("transitions from streaming_audio to completed", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.transitionToStreaming();
            aggregate.completeStream(1000, 5, providerId.getValue());
            expect(aggregate.getVoiceState().getValue()).toBe("completed");
        });

        it("transitions from streaming_audio to failed via interrupt", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.transitionToStreaming();
            aggregate.interruptStream("user_cancel", 0);
            expect(aggregate.getVoiceState().getValue()).toBe("recovering");
        });

        it("transitions from synthesizing to failed", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.failSynthesis("synthesis_error", providerId.getValue());
            expect(aggregate.getVoiceState().getValue()).toBe("failed");
        });

        it("transitions from failed to recovering", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.failSynthesis("error", providerId.getValue());
            aggregate.startRecovery("retry");
            expect(aggregate.getVoiceState().getValue()).toBe("recovering");
        });

        it("transitions from recovering to waiting_for_input", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.failSynthesis("error", providerId.getValue());
            aggregate.startRecovery("retry");
            aggregate.recover();
            expect(aggregate.getVoiceState().getValue()).toBe("waiting_for_input");
        });

        it("transitions from waiting_for_input to paused", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.pause();
            expect(aggregate.getVoiceState().getValue()).toBe("paused");
        });

        it("transitions from paused back to waiting_for_input", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.pause();
            aggregate.resume();
            expect(aggregate.getVoiceState().getValue()).toBe("waiting_for_input");
        });

        it("throws on invalid state transition", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            expect(() => aggregate.completeStream(1000, 1, providerId.getValue())).toThrow();
        });
    });

    describe("audio tracking", () => {
        it("tracks audio duration and chunks", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            aggregate.transitionToStreaming();
            aggregate.recordAudioChunk(AudioChunkSequence.create(0), 100, AudioCodec.pcm().getValue());
            aggregate.recordAudioChunk(AudioChunkSequence.create(1), 200, AudioCodec.pcm().getValue());
            expect(aggregate.getTotalAudioDurationMs()).toBe(0);
            expect(aggregate.getTotalChunksProcessed()).toBe(2);
        });
    });

    describe("budget tracking", () => {
        it("records budget exceeded events", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.recordBudgetExceeded("latency", 250, 200);
            const events = aggregate.getUncommittedEvents();
            expect(events).toHaveLength(2);
            expect(events[1].eventType).toBe("EVT_VOICE_BudgetExceeded");
        });
    });

    describe("provider health", () => {
        it("updates provider health", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            const health = ProviderCostMetadata.free("provider-1");
            aggregate.updateProviderHealth("provider-1", health);
            expect(aggregate.getVersion()).toBe(1);
            const events = aggregate.getUncommittedEvents();
            expect(events[events.length - 1].eventType).toBe("EVT_VOICE_ProviderStatusChanged");
        });
    });

    describe("snapshot", () => {
        it("returns a serializable snapshot", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            aggregate.startSynthesis("req-1", providerId);
            const snapshot = aggregate.getSnapshot();
            expect(snapshot).toHaveProperty("voiceId", "voice-123");
            expect(snapshot).toHaveProperty("voiceState", "synthesizing");
            expect(snapshot).toHaveProperty("version", 1);
        });
    });

    describe("commitEvents", () => {
        it("clears uncommitted events after commit", () => {
            const aggregate = VoiceAggregate.create(voiceId, providerId);
            expect(aggregate.getUncommittedEvents()).toHaveLength(1);
            aggregate.commitEvents();
            expect(aggregate.getUncommittedEvents()).toHaveLength(0);
        });
    });
});
