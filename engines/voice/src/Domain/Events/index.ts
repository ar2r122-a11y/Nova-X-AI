import { IDomainEvent } from "@nova-x-ai/core";
import { VoiceId } from "../ValueObjects/VoiceId";
import { VoiceProfileId } from "../ValueObjects/VoiceProfileId";
import { VoiceSessionId } from "../ValueObjects/VoiceSessionId";
import { SynthesisRequestId } from "../ValueObjects/SynthesisRequestId";
import { TranscriptionRequestId } from "../ValueObjects/TranscriptionRequestId";
import { AudioChunkSequence } from "../ValueObjects/AudioChunkSequence";
import { VoiceProviderId } from "../ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../ValueObjects/ProviderCostMetadata";

export class VoiceInitializedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_VoiceInitialized";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class VoiceSynthesisStartedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_SynthesisStarted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly text: string,
        public readonly profileId: string,
        public readonly providerId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceAudioChunkEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_AudioChunk";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly sequence: number,
        public readonly chunkSizeBytes: number,
        public readonly codec: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceStreamCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_StreamCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly durationMs: number,
        public readonly totalChunks: number,
        public readonly providerId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceStreamInterruptedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_StreamInterrupted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly reason: string,
        public readonly sequenceIndex: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceSynthesisFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_SynthesisFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly reason: string,
        public readonly providerId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceRecoveryStartedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_RecoveryStarted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly reason: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceProviderStatusChangedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_ProviderStatusChanged";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly providerId: string,
        public readonly previousStatus: string,
        public readonly newStatus: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceSessionCreatedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_SessionCreated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly sessionId: string,
        public readonly voiceId: string,
        public readonly profileId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceSessionCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_SessionCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly sessionId: string,
        public readonly voiceId: string,
        public readonly durationMs: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceSessionFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_SessionFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly sessionId: string,
        public readonly voiceId: string,
        public readonly reason: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceBudgetExceededEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_BudgetExceeded";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly voiceId: string,
        public readonly budgetType: string,
        public readonly currentValue: number,
        public readonly limitValue: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceProfileCreatedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_VoiceProfileCreated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly profileId: string,
        public readonly characterId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceProfileUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_VoiceProfileUpdated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly profileId: string,
        public readonly updatedFields: string[],
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class VoiceProfileDeletedEvent implements IDomainEvent {
    readonly eventType = "EVT_VOICE_VoiceProfileDeleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly profileId: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}
