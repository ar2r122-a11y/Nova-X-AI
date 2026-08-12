import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IVoiceRepository } from "../../Domain/Repositories/IVoiceRepository";
import { VoiceAggregate } from "../../Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../Domain/ValueObjects/VoiceId";
import { VoiceStateRef } from "../../Domain/ValueObjects/VoiceState";
import { VoiceProviderId } from "../../Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../Domain/ValueObjects/ProviderCostMetadata";

interface StoredVoiceEntity {
    id: string;
    data: string;
}

export class VoiceRepositoryImpl implements IVoiceRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredVoiceEntity | null>;
        save(entity: StoredVoiceEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredVoiceEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredVoiceEntity>("voices");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(voiceId: VoiceId): Promise<VoiceAggregate | null> {
        const entity = await this.storageRepository.getById(voiceId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async save(aggregate: VoiceAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredVoiceEntity = {
            id: aggregate.getVoiceId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): VoiceAggregate {
        const voiceId = VoiceId.create(snapshot.voiceId);
        const voiceState = VoiceStateRef.create(snapshot.voiceState);
        const providerId = VoiceProviderId.create(snapshot.providerId);
        const lastProviderHealth = ProviderCostMetadata.create(
            snapshot.lastProviderHealth.estimatedCostMicros,
            snapshot.lastProviderHealth.currency,
            snapshot.lastProviderHealth.providerId
        );
        return VoiceAggregate.reconstitute(
            voiceId,
            voiceState,
            providerId,
            snapshot.version,
            snapshot.totalAudioDurationMs,
            snapshot.totalChunksProcessed,
            lastProviderHealth,
            snapshot.consecutiveFailures
        );
    }
}
