import { IDomainEvent } from "@nova-x-ai/core";
import { VoiceId } from "../ValueObjects/VoiceId";
import { VoiceStateRef } from "../ValueObjects/VoiceState";
import { AudioDuration } from "../ValueObjects/AudioDuration";
import { VoiceProviderId } from "../ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../ValueObjects/ProviderCostMetadata";
import { AudioChunkSequence } from "../ValueObjects/AudioChunkSequence";
import {
    VoiceInitializedEvent,
    VoiceSynthesisStartedEvent,
    VoiceAudioChunkEvent,
    VoiceStreamCompletedEvent,
    VoiceStreamInterruptedEvent,
    VoiceSynthesisFailedEvent,
    VoiceRecoveryStartedEvent,
    VoiceProviderStatusChangedEvent,
    VoiceBudgetExceededEvent
} from "../Events";

export class VoiceAggregate {
    private readonly voiceId: VoiceId;
    private voiceState: VoiceStateRef;
    private providerId: VoiceProviderId;
    private readonly uncommittedEvents: IDomainEvent[];
    private version: number;
    private lastRequestId: string | null;
    private totalAudioDurationMs: number;
    private totalChunksProcessed: number;
    private lastProviderHealth: ProviderCostMetadata;
    private consecutiveFailures: number;

    private constructor(
        voiceId: VoiceId,
        voiceState: VoiceStateRef,
        providerId: VoiceProviderId,
        version: number,
        totalAudioDurationMs: number,
        totalChunksProcessed: number,
        lastProviderHealth: ProviderCostMetadata,
        consecutiveFailures: number
    ) {
        this.voiceId = voiceId;
        this.voiceState = voiceState;
        this.providerId = providerId;
        this.uncommittedEvents = [];
        this.version = version;
        this.lastRequestId = null;
        this.totalAudioDurationMs = totalAudioDurationMs;
        this.totalChunksProcessed = totalChunksProcessed;
        this.lastProviderHealth = lastProviderHealth;
        this.consecutiveFailures = consecutiveFailures;
    }

    static create(voiceId: VoiceId, providerId: VoiceProviderId): VoiceAggregate {
        const aggregate = new VoiceAggregate(
            voiceId,
            VoiceStateRef.waitingForInput(),
            providerId,
            0,
            0,
            0,
            ProviderCostMetadata.free(providerId.getValue()),
            0
        );
        aggregate.uncommittedEvents.push(new VoiceInitializedEvent(voiceId.getValue(), Date.now(), ""));
        return aggregate;
    }

    static reconstitute(
        voiceId: VoiceId,
        voiceState: VoiceStateRef,
        providerId: VoiceProviderId,
        version: number,
        totalAudioDurationMs: number,
        totalChunksProcessed: number,
        lastProviderHealth: ProviderCostMetadata,
        consecutiveFailures: number
    ): VoiceAggregate {
        return new VoiceAggregate(voiceId, voiceState, providerId, version, totalAudioDurationMs, totalChunksProcessed, lastProviderHealth, consecutiveFailures);
    }

    getVoiceId(): VoiceId {
        return this.voiceId;
    }

    getVoiceState(): VoiceStateRef {
        return this.voiceState;
    }

    getProviderId(): VoiceProviderId {
        return this.providerId;
    }

    getVersion(): number {
        return this.version;
    }

    getLastRequestId(): string | null {
        return this.lastRequestId;
    }

    getTotalAudioDurationMs(): number {
        return this.totalAudioDurationMs;
    }

    getTotalChunksProcessed(): number {
        return this.totalChunksProcessed;
    }

    getLastProviderHealth(): ProviderCostMetadata {
        return this.lastProviderHealth;
    }

    getConsecutiveFailures(): number {
        return this.consecutiveFailures;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    startSynthesis(requestId: string, providerId: VoiceProviderId): void {
        this.ensureState("waiting_for_input");
        this.voiceState = VoiceStateRef.synthesizing();
        this.lastRequestId = requestId;
        this.version++;
        this.uncommittedEvents.push(new VoiceSynthesisStartedEvent(this.voiceId.getValue(), requestId, "", "", providerId.getValue(), ""));
    }

    transitionToStreaming(): void {
        this.ensureState("synthesizing");
        this.voiceState = VoiceStateRef.streamingAudio();
        this.version++;
    }

    recordAudioChunk(sequence: AudioChunkSequence, chunkSizeBytes: number, codec: string): void {
        this.ensureState("streaming_audio");
        this.totalChunksProcessed++;
        this.version++;
        this.uncommittedEvents.push(new VoiceAudioChunkEvent(
            this.voiceId.getValue(),
            this.lastRequestId ?? "",
            sequence.getValue(),
            chunkSizeBytes,
            codec,
            ""
        ));
    }

    completeStream(durationMs: number, totalChunks: number, providerId: string): void {
        this.ensureState("streaming_audio");
        this.voiceState = VoiceStateRef.completed();
        this.totalAudioDurationMs += durationMs;
        this.version++;
        this.uncommittedEvents.push(new VoiceStreamCompletedEvent(
            this.voiceId.getValue(),
            this.lastRequestId ?? "",
            durationMs,
            totalChunks,
            providerId,
            ""
        ));
    }

    interruptStream(reason: string, sequenceIndex: number): void {
        this.ensureState("streaming_audio");
        this.voiceState = VoiceStateRef.recovering();
        this.version++;
        this.uncommittedEvents.push(new VoiceStreamInterruptedEvent(
            this.voiceId.getValue(),
            this.lastRequestId ?? "",
            reason,
            sequenceIndex,
            ""
        ));
    }

    failSynthesis(reason: string, providerId: string): void {
        this.ensureState("synthesizing");
        this.voiceState = VoiceStateRef.failed();
        this.consecutiveFailures++;
        this.version++;
        this.uncommittedEvents.push(new VoiceSynthesisFailedEvent(
            this.voiceId.getValue(),
            this.lastRequestId ?? "",
            reason,
            providerId,
            ""
        ));
    }

    startRecovery(reason: string): void {
        this.ensureState("failed");
        this.voiceState = VoiceStateRef.recovering();
        this.version++;
        this.uncommittedEvents.push(new VoiceRecoveryStartedEvent(this.voiceId.getValue(), reason, ""));
    }

    recover(): void {
        this.ensureState("recovering");
        this.voiceState = VoiceStateRef.waitingForInput();
        this.consecutiveFailures = 0;
        this.lastRequestId = null;
        this.version++;
    }

    pause(): void {
        this.ensureState("waiting_for_input");
        this.voiceState = VoiceStateRef.paused();
        this.version++;
    }

    resume(): void {
        this.ensureState("paused");
        this.voiceState = VoiceStateRef.waitingForInput();
        this.version++;
    }

    updateProviderHealth(providerId: string, health: ProviderCostMetadata): void {
        this.providerId = VoiceProviderId.create(providerId);
        this.lastProviderHealth = health;
        this.version++;
        this.uncommittedEvents.push(new VoiceProviderStatusChangedEvent(
            providerId,
            this.consecutiveFailures > 0 ? "unhealthy" : "healthy",
            health.isFree() ? "healthy" : "degraded",
            ""
        ));
    }

    recordBudgetExceeded(budgetType: string, currentValue: number, limitValue: number): void {
        this.ensureState("waiting_for_input");
        this.version++;
        this.uncommittedEvents.push(new VoiceBudgetExceededEvent(
            this.voiceId.getValue(),
            budgetType,
            currentValue,
            limitValue,
            ""
        ));
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            voiceId: this.voiceId.getValue(),
            voiceState: this.voiceState.getValue(),
            providerId: this.providerId.getValue(),
            version: this.version,
            lastRequestId: this.lastRequestId,
            totalAudioDurationMs: this.totalAudioDurationMs,
            totalChunksProcessed: this.totalChunksProcessed,
            lastProviderHealth: {
                estimatedCostMicros: this.lastProviderHealth.getEstimatedCostMicros(),
                currency: this.lastProviderHealth.getCurrency(),
                providerId: this.lastProviderHealth.getProviderId()
            },
            consecutiveFailures: this.consecutiveFailures
        };
    }

    private ensureState(expected: "waiting_for_input" | "synthesizing" | "streaming_audio" | "failed" | "recovering" | "paused"): void {
        if (this.voiceState.getValue() !== expected) {
            throw new Error(`Cannot perform operation in state: ${this.voiceState.getValue()}`);
        }
    }
}
