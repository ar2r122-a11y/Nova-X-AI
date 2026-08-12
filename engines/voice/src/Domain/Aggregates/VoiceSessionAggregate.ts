import { IDomainEvent } from "@nova-x-ai/core";
import { VoiceSessionId } from "../ValueObjects/VoiceSessionId";
import { VoiceId } from "../ValueObjects/VoiceId";
import { VoiceProfileId } from "../ValueObjects/VoiceProfileId";
import { VoiceSessionStateRef } from "../ValueObjects/VoiceSessionState";
import { AudioDuration } from "../ValueObjects/AudioDuration";
import {
    VoiceSessionCreatedEvent,
    VoiceSessionCompletedEvent,
    VoiceSessionFailedEvent
} from "../Events";

export class VoiceSessionAggregate {
    private readonly sessionId: VoiceSessionId;
    private readonly voiceId: VoiceId;
    private readonly profileId: VoiceProfileId;
    private sessionState: VoiceSessionStateRef;
    private readonly uncommittedEvents: IDomainEvent[];
    private version: number;
    private startedAt: number;
    private endedAt: number | null;
    private totalAudioDurationMs: number;
    private text: string;

    private constructor(
        sessionId: VoiceSessionId,
        voiceId: VoiceId,
        profileId: VoiceProfileId,
        sessionState: VoiceSessionStateRef,
        version: number,
        startedAt: number,
        endedAt: number | null,
        totalAudioDurationMs: number,
        text: string
    ) {
        this.sessionId = sessionId;
        this.voiceId = voiceId;
        this.profileId = profileId;
        this.sessionState = sessionState;
        this.uncommittedEvents = [];
        this.version = version;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.totalAudioDurationMs = totalAudioDurationMs;
        this.text = text;
    }

    static create(sessionId: VoiceSessionId, voiceId: VoiceId, profileId: VoiceProfileId, text: string): VoiceSessionAggregate {
        const aggregate = new VoiceSessionAggregate(
            sessionId,
            voiceId,
            profileId,
            VoiceSessionStateRef.idle(),
            0,
            Date.now(),
            null,
            0,
            text
        );
        aggregate.sessionState = VoiceSessionStateRef.active();
        aggregate.version++;
        aggregate.uncommittedEvents.push(new VoiceSessionCreatedEvent(sessionId.getValue(), voiceId.getValue(), profileId.getValue(), ""));
        return aggregate;
    }

    static reconstitute(
        sessionId: VoiceSessionId,
        voiceId: VoiceId,
        profileId: VoiceProfileId,
        sessionState: VoiceSessionStateRef,
        version: number,
        startedAt: number,
        endedAt: number | null,
        totalAudioDurationMs: number,
        text: string
    ): VoiceSessionAggregate {
        return new VoiceSessionAggregate(sessionId, voiceId, profileId, sessionState, version, startedAt, endedAt, totalAudioDurationMs, text);
    }

    getSessionId(): VoiceSessionId {
        return this.sessionId;
    }

    getVoiceId(): VoiceId {
        return this.voiceId;
    }

    getProfileId(): VoiceProfileId {
        return this.profileId;
    }

    getSessionState(): VoiceSessionStateRef {
        return this.sessionState;
    }

    getVersion(): number {
        return this.version;
    }

    getStartedAt(): number {
        return this.startedAt;
    }

    getEndedAt(): number | null {
        return this.endedAt;
    }

    getTotalAudioDurationMs(): number {
        return this.totalAudioDurationMs;
    }

    getText(): string {
        return this.text;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    complete(durationMs: number): void {
        this.ensureState("active");
        this.sessionState = VoiceSessionStateRef.completed();
        this.endedAt = Date.now();
        this.totalAudioDurationMs = durationMs;
        this.version++;
        this.uncommittedEvents.push(new VoiceSessionCompletedEvent(this.sessionId.getValue(), this.voiceId.getValue(), durationMs, ""));
    }

    fail(reason: string): void {
        this.ensureState("active");
        this.sessionState = VoiceSessionStateRef.failed();
        this.endedAt = Date.now();
        this.version++;
        this.uncommittedEvents.push(new VoiceSessionFailedEvent(this.sessionId.getValue(), this.voiceId.getValue(), reason, ""));
    }

    interrupt(): void {
        this.ensureState("active");
        this.sessionState = VoiceSessionStateRef.interrupted();
        this.endedAt = Date.now();
        this.version++;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            sessionId: this.sessionId.getValue(),
            voiceId: this.voiceId.getValue(),
            profileId: this.profileId.getValue(),
            sessionState: this.sessionState.getValue(),
            version: this.version,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            totalAudioDurationMs: this.totalAudioDurationMs,
            text: this.text
        };
    }

    private ensureState(expected: "active"): void {
        if (this.sessionState.getValue() !== expected) {
            throw new Error(`Cannot perform operation in session state: ${this.sessionState.getValue()}`);
        }
    }
}
