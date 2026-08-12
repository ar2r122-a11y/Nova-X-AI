import type { IEventBus } from "@nova-x-ai/core";
import type { IVoiceRepository } from "../Domain/Repositories/IVoiceRepository";
import type { IVoiceSessionRepository } from "../Domain/Repositories/IVoiceSessionRepository";
import type { IVoiceProfileRepository } from "../Domain/Repositories/IVoiceProfileRepository";
import type { IVoiceEventStoreRepository } from "../Domain/Repositories/IVoiceEventStoreRepository";
import type { IScheduledVoiceTaskRepository } from "../Domain/Repositories/IScheduledVoiceTaskRepository";
import type { ITimeSimulationService } from "../Domain/Services/ITimeSimulationService";
import type { IAudioCompressionService } from "../Domain/Services";
import type { IVoiceCacheService } from "../Domain/Services";
import type { IMultiSpeakerCoordinator } from "../Domain/Services";
import { IVoiceEngine } from "../Contracts/IVoiceEngine";
import { VoiceAggregate } from "../Domain/Aggregates/VoiceAggregate";
import { VoiceSessionAggregate } from "../Domain/Aggregates/VoiceSessionAggregate";
import { VoiceProfile } from "../Domain/Entities/VoiceProfile";
import { VoiceId } from "../Domain/ValueObjects/VoiceId";
import { VoiceSessionId } from "../Domain/ValueObjects/VoiceSessionId";
import { VoiceProfileId } from "../Domain/ValueObjects/VoiceProfileId";
import { VoiceStateRef } from "../Domain/ValueObjects/VoiceState";
import { VoiceSessionStateRef } from "../Domain/ValueObjects/VoiceSessionState";
import { AudioChunkSequence } from "../Domain/ValueObjects/AudioChunkSequence";
import { AudioSampleRate } from "../Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../Domain/ValueObjects/AudioBitDepth";
import { AudioCodec } from "../Domain/ValueObjects/AudioCodec";
import { AudioDuration } from "../Domain/ValueObjects/AudioDuration";
import { VoiceProviderId } from "../Domain/ValueObjects/VoiceProviderId";
import { VoiceLocale } from "../Domain/ValueObjects/VoiceLocale";
import { ProviderCostMetadata } from "../Domain/ValueObjects/ProviderCostMetadata";
import { AudioChunk } from "../Domain/ValueObjects/AudioChunk";
import { PCMBuffer } from "../Domain/ValueObjects/PCMBuffer";
import { AudioStreamEntity } from "../Domain/Entities/AudioStreamEntity";
import { ScheduledVoiceTaskEntity } from "../Domain/Entities/ScheduledVoiceTaskEntity";
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
} from "../Domain/Events";
import {
    InvalidVoiceStateException,
    VoiceProviderException,
    VoiceQuotaExceededException,
    VoiceTimeoutException,
    VoiceProfileNotFoundException,
    VoiceSessionNotFoundException,
    VoiceProviderUnavailableException
} from "../Domain/Exceptions";
import { FreeFirstProviderPolicy } from "../Domain/Policies/FreeFirstProviderPolicy";
import { VoiceRateLimitPolicy } from "../Domain/Policies/VoiceRateLimitPolicy";
import { AudioQualityPolicy } from "../Domain/Policies/AudioQualityPolicy";
import { SynthesisQuotaPolicy } from "../Domain/Policies/SynthesisQuotaPolicy";
import { RetryPolicy } from "../Domain/Policies/RetryPolicy";
import { StreamingPolicy } from "../Domain/Policies/StreamingPolicy";
import { VoiceSafetyPolicy } from "../Domain/Policies/VoiceSafetyPolicy";
import { ValidVoiceProfileSpecification } from "../Domain/Specifications";
import { AudioStreamHandleDto } from "../Application/DTO/AudioStreamHandleDto";

export class VoiceEngine implements IVoiceEngine {
    readonly eventBus: IEventBus;
    readonly voiceRepository: IVoiceRepository;
    readonly sessionRepository: IVoiceSessionRepository;
    readonly profileRepository: IVoiceProfileRepository;
    readonly eventStoreRepository: IVoiceEventStoreRepository;
    readonly scheduledTaskRepository: IScheduledVoiceTaskRepository;
    readonly timeSimulationService: ITimeSimulationService;
    readonly audioCompressionService: IAudioCompressionService;
    readonly voiceCacheService: IVoiceCacheService;
    readonly multiSpeakerCoordinator: IMultiSpeakerCoordinator;

    private requestHistory: number[] = [];
    private activeStreams: Map<string, AudioStreamEntity> = new Map();

    constructor(
        eventBus: IEventBus,
        voiceRepository: IVoiceRepository,
        sessionRepository: IVoiceSessionRepository,
        profileRepository: IVoiceProfileRepository,
        eventStoreRepository: IVoiceEventStoreRepository,
        scheduledTaskRepository: IScheduledVoiceTaskRepository,
        timeSimulationService: ITimeSimulationService,
        audioCompressionService: IAudioCompressionService,
        voiceCacheService: IVoiceCacheService,
        multiSpeakerCoordinator: IMultiSpeakerCoordinator
    ) {
        this.eventBus = eventBus;
        this.voiceRepository = voiceRepository;
        this.sessionRepository = sessionRepository;
        this.profileRepository = profileRepository;
        this.eventStoreRepository = eventStoreRepository;
        this.scheduledTaskRepository = scheduledTaskRepository;
        this.timeSimulationService = timeSimulationService;
        this.audioCompressionService = audioCompressionService;
        this.voiceCacheService = voiceCacheService;
        this.multiSpeakerCoordinator = multiSpeakerCoordinator;
    }

    async initialize(voiceId: string): Promise<void> {
        const voiceIdVo = VoiceId.create(voiceId);
        const existing = await this.voiceRepository.findById(voiceIdVo);
        if (existing) {
            return;
        }
        const aggregate = VoiceAggregate.create(voiceIdVo, VoiceProviderId.create("default"));
        await this.voiceRepository.save(aggregate);
        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }

    async synthesizeSpeech(command: import("../Application/Commands/SynthesizeSpeechCommand").SynthesizeSpeechCommand): Promise<import("../Application/DTO/AudioStreamHandleDto").AudioStreamHandleDto> {
        const voiceIdVo = VoiceId.create(command.voiceId);
        const profileIdVo = VoiceProfileId.create(command.voiceProfileId);

        const rateLimitPolicy = new VoiceRateLimitPolicy();
        const remaining = rateLimitPolicy.getRemainingRequests(this.requestHistory);
        if (remaining <= 0) {
            throw new VoiceQuotaExceededException("rate_limit");
        }
        this.requestHistory = rateLimitPolicy.recordRequest(this.requestHistory);

        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            throw new Error(`Voice not found: ${command.voiceId}`);
        }

        const profile = await this.profileRepository.findById(profileIdVo);
        if (!profile) {
            throw new VoiceProfileNotFoundException(command.voiceProfileId);
        }

        if (!ValidVoiceProfileSpecification.isSatisfiedBy(profile)) {
            throw new VoiceProfileNotFoundException(command.voiceProfileId);
        }

        const sanitizedText = VoiceSafetyPolicy.sanitizeText(command.text);
        SynthesisQuotaPolicy.validateInputLength(sanitizedText);

        const providerId = command.providerId ? VoiceProviderId.create(command.providerId) : aggregate.getProviderId();
        aggregate.startSynthesis(command.correlationId, providerId);
        await this.voiceRepository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        const streamId = `stream-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const streamEntity = AudioStreamEntity.create(streamId, command.voiceId, command.correlationId, command.voiceProfileId, providerId.getValue(), sanitizedText);
        this.activeStreams.set(streamId, streamEntity);

        return AudioStreamHandleDto.fromResult({
            streamId,
            requestId: command.correlationId,
            voiceId: command.voiceId,
            providerId: providerId.getValue(),
            profileId: command.voiceProfileId,
            status: "synthesizing",
            estimatedDurationMs: 0,
            correlationId: command.correlationId
        });
    }

    async interrupt(command: import("../Application/Commands/InterruptCommand").InterruptCommand): Promise<void> {
        const voiceIdVo = VoiceId.create(command.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            throw new Error(`Voice not found: ${command.voiceId}`);
        }

        aggregate.interruptStream(command.reason, 0);
        await this.voiceRepository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        this.activeStreams.forEach((stream, streamId) => {
            if (stream.getRequestId() === command.requestId) {
                stream.cancel();
            }
        });

        aggregate.recover();
        await this.voiceRepository.save(aggregate);
        const recoveryEvents = aggregate.getUncommittedEvents();
        for (const event of recoveryEvents) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }

    async pause(command: import("../Application/Commands/PauseCommand").PauseCommand): Promise<void> {
        const voiceIdVo = VoiceId.create(command.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            throw new Error(`Voice not found: ${command.voiceId}`);
        }
        aggregate.pause();
        await this.voiceRepository.save(aggregate);
    }

    async resume(command: import("../Application/Commands/ResumeCommand").ResumeCommand): Promise<void> {
        const voiceIdVo = VoiceId.create(command.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            throw new Error(`Voice not found: ${command.voiceId}`);
        }
        aggregate.resume();
        await this.voiceRepository.save(aggregate);
    }

    async cancelStream(command: import("../Application/Commands/CancelStreamCommand").CancelStreamCommand): Promise<void> {
        const stream = this.activeStreams.get(command.streamId);
        if (stream) {
            stream.cancel();
            this.activeStreams.delete(command.streamId);
        }
    }

    async regenerateAudio(command: import("../Application/Commands/RegenerateAudioCommand").RegenerateAudioCommand): Promise<import("../Application/DTO/AudioStreamHandleDto").AudioStreamHandleDto> {
        const synthesizeCommand = new (await import("../Application/Commands/SynthesizeSpeechCommand")).SynthesizeSpeechCommand(
            command.voiceId,
            command.text,
            command.voiceProfileId,
            command.providerId,
            command.correlationId,
            command.causationId,
            command.claims
        );
        return this.synthesizeSpeech(synthesizeCommand);
    }

    async retryUtterance(command: import("../Application/Commands/RetryUtteranceCommand").RetryUtteranceCommand): Promise<import("../Application/DTO/AudioStreamHandleDto").AudioStreamHandleDto> {
        const voiceIdVo = VoiceId.create(command.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            throw new Error(`Voice not found: ${command.voiceId}`);
        }

        if (aggregate.getConsecutiveFailures() >= 3) {
            aggregate.startRecovery("max_retries_exceeded");
            await this.voiceRepository.save(aggregate);
            const events = aggregate.getUncommittedEvents();
            for (const event of events) {
                await this.eventBus.publish(event);
            }
            aggregate.commitEvents();
            throw new VoiceProviderException(aggregate.getProviderId().getValue(), "max retries exceeded");
        }

        return this.synthesizeSpeech(new (await import("../Application/Commands/SynthesizeSpeechCommand")).SynthesizeSpeechCommand(
            command.voiceId,
            "",
            "",
            aggregate.getProviderId().getValue(),
            command.correlationId,
            command.causationId,
            command.claims
        ));
    }

    async createVoiceProfile(command: import("../Application/Commands/CreateVoiceProfileCommand").CreateVoiceProfileCommand): Promise<void> {
        const profileId = (await import("../Domain/ValueObjects/VoiceProfileId")).VoiceProfileId.generate();
        const locale = (await import("../Domain/ValueObjects/VoiceLocale")).VoiceLocale.create(command.locale);
        const profile = VoiceProfile.create(profileId, command.characterId, command.voiceId, locale);
        await this.profileRepository.save(profile);
        const event = new VoiceProfileCreatedEvent(profileId.getValue(), command.characterId, command.correlationId);
        await this.eventBus.publish(event);
    }

    async updateVoiceProfile(command: import("../Application/Commands/UpdateVoiceProfileCommand").UpdateVoiceProfileCommand): Promise<void> {
        const { VoiceProfileId } = await import("../Domain/ValueObjects/VoiceProfileId");
        const profileId = VoiceProfileId.create(command.profileId);
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new VoiceProfileNotFoundException(command.profileId);
        }
        if (command.speakingRate !== undefined) {
            profile.updateSpeakingRate(command.speakingRate);
        }
        if (command.pitchModifier !== undefined) {
            profile.updatePitchModifier(command.pitchModifier);
        }
        await this.profileRepository.save(profile);
        const updatedFields: string[] = [];
        if (command.speakingRate !== undefined) updatedFields.push("speakingRate");
        if (command.pitchModifier !== undefined) updatedFields.push("pitchModifier");
        const event = new VoiceProfileUpdatedEvent(profileId.getValue(), updatedFields, command.correlationId);
        await this.eventBus.publish(event);
    }

    async deleteVoiceProfile(command: import("../Application/Commands/DeleteVoiceProfileCommand").DeleteVoiceProfileCommand): Promise<void> {
        const { VoiceProfileId } = await import("../Domain/ValueObjects/VoiceProfileId");
        const profileId = VoiceProfileId.create(command.profileId);
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new VoiceProfileNotFoundException(command.profileId);
        }
        await this.profileRepository.delete(profileId);
        const event = new VoiceProfileDeletedEvent(profileId.getValue(), command.correlationId);
        await this.eventBus.publish(event);
    }

    async scheduleVoiceTask(command: import("../Application/Commands/ScheduleVoiceTaskCommand").ScheduleVoiceTaskCommand): Promise<void> {
        const task = ScheduledVoiceTaskEntity.create(
            `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            command.voiceId,
            command.text,
            command.profileId,
            command.scheduledAt,
            command.priority,
            command.maxRetries
        );
        await this.scheduledTaskRepository.save(task);
    }

    async getVoiceProfile(query: import("../Application/Queries/GetVoiceProfileQuery").GetVoiceProfileQuery): Promise<import("../Application/DTO/VoiceProfileDto").VoiceProfileDto> {
        const { VoiceProfileId } = await import("../Domain/ValueObjects/VoiceProfileId");
        const profileId = VoiceProfileId.create(query.profileId);
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new VoiceProfileNotFoundException(query.profileId);
        }
        return (await import("../Application/DTO/VoiceProfileDto")).VoiceProfileDto.fromProfile(profile as any);
    }

    async getVoiceSession(query: import("../Application/Queries/GetVoiceSessionQuery").GetVoiceSessionQuery): Promise<import("../Application/DTO/VoiceSessionDto").VoiceSessionDto> {
        const { VoiceSessionId } = await import("../Domain/ValueObjects/VoiceSessionId");
        const sessionId = VoiceSessionId.create(query.sessionId);
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new VoiceSessionNotFoundException(query.sessionId);
        }
        return (await import("../Application/DTO/VoiceSessionDto")).VoiceSessionDto.fromAggregate(session as any);
    }

    async getAudioStream(query: import("../Application/Queries/GetAudioStreamQuery").GetAudioStreamQuery): Promise<import("../Application/DTO/AudioStreamDto").AudioStreamDto> {
        const stream = this.activeStreams.get(query.streamId);
        if (!stream) {
            throw new Error(`Audio stream not found: ${query.streamId}`);
        }
        return (await import("../Application/DTO/AudioStreamDto")).AudioStreamDto.fromAggregate(stream as any);
    }

    async listVoiceProfiles(query: import("../Application/Queries/ListVoiceProfilesQuery").ListVoiceProfilesQuery): Promise<import("../Application/DTO/VoiceProfileSummaryDto").VoiceProfileSummaryDto[]> {
        let profiles: VoiceProfile[];
        if (query.characterId) {
            const profile = await this.profileRepository.findByCharacterId(query.characterId);
            profiles = profile ? [profile] : [];
        } else {
            profiles = await this.profileRepository.findAll();
        }
        const { VoiceProfileSummaryDto } = await import("../Application/DTO/VoiceProfileSummaryDto");
        return profiles.map(profile => new VoiceProfileSummaryDto(
            profile.getProfileId().getValue(),
            profile.getCharacterId(),
            profile.getVoiceId(),
            profile.getLocale().getValue(),
            profile.getSpeakingRate(),
            profile.getConfigurationVersion()
        ));
    }

    async getSynthesisStatus(query: import("../Application/Queries/GetSynthesisStatusQuery").GetSynthesisStatusQuery): Promise<import("../Application/DTO/VoiceSynthesisResultDto").VoiceSynthesisResultDto> {
        const { VoiceId } = await import("../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(query.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            throw new Error(`Voice not found: ${query.voiceId}`);
        }
        return new (await import("../Application/DTO/VoiceSynthesisResultDto")).VoiceSynthesisResultDto(
            aggregate.getLastRequestId() ?? "",
            aggregate.getVoiceId().getValue(),
            aggregate.getVoiceState().getValue(),
            aggregate.getTotalAudioDurationMs(),
            aggregate.getTotalChunksProcessed(),
            aggregate.getProviderId().getValue(),
            aggregate.getLastProviderHealth().getEstimatedCostMicros(),
            query.requesterId ?? ""
        );
    }

    async getProviderHealth(query: import("../Application/Queries/GetProviderHealthQuery").GetProviderHealthQuery): Promise<import("../Application/DTO/ProviderHealthDto").ProviderHealthDto> {
        const { VoiceId } = await import("../Domain/ValueObjects/VoiceId");
        const { VoiceProviderId } = await import("../Domain/ValueObjects/VoiceProviderId");
        const voiceId = VoiceId.create(query.providerId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            return new (await import("../Application/DTO/ProviderHealthDto")).ProviderHealthDto(
                query.providerId,
                "healthy",
                0,
                Date.now(),
                0,
                0
            );
        }
        return new (await import("../Application/DTO/ProviderHealthDto")).ProviderHealthDto(
            aggregate.getProviderId().getValue(),
            aggregate.getConsecutiveFailures() > 0 ? "unhealthy" : "healthy",
            0,
            Date.now(),
            aggregate.getConsecutiveFailures(),
            100 - aggregate.getConsecutiveFailures()
        );
    }

    async getAudioCache(query: import("../Application/Queries/GetAudioCacheQuery").GetAudioCacheQuery): Promise<import("../Application/DTO/AudioCacheDto").AudioCacheDto> {
        const { VoiceId } = await import("../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(query.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            return new (await import("../Application/DTO/AudioCacheDto")).AudioCacheDto(query.voiceId, 0, 0, null);
        }
        return new (await import("../Application/DTO/AudioCacheDto")).AudioCacheDto(
            query.voiceId,
            aggregate.getTotalChunksProcessed(),
            0,
            Date.now()
        );
    }

    async takeSnapshot(voiceId: string): Promise<object> {
        const voiceIdVo = VoiceId.create(voiceId);
        const aggregate = await this.voiceRepository.findById(voiceIdVo);
        if (!aggregate) {
            return {};
        }
        return aggregate.getSnapshot();
    }

    async shutdown(): Promise<void> {
        this.activeStreams.clear();
    }
}
