import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IVoiceSessionRepository } from "../../Domain/Repositories/IVoiceSessionRepository";
import { VoiceSessionAggregate } from "../../Domain/Aggregates/VoiceSessionAggregate";
import { VoiceSessionId } from "../../Domain/ValueObjects/VoiceSessionId";
import { VoiceId } from "../../Domain/ValueObjects/VoiceId";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";
import { VoiceSessionStateRef } from "../../Domain/ValueObjects/VoiceSessionState";

interface StoredVoiceSessionEntity {
    id: string;
    data: string;
}

export class VoiceSessionRepositoryImpl implements IVoiceSessionRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredVoiceSessionEntity | null>;
        save(entity: StoredVoiceSessionEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredVoiceSessionEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredVoiceSessionEntity>("voice-sessions");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(sessionId: VoiceSessionId): Promise<VoiceSessionAggregate | null> {
        const entity = await this.storageRepository.getById(sessionId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async findByVoiceId(voiceId: string): Promise<VoiceSessionAggregate[]> {
        const all = await this.storageRepository.getAll();
        return all
            .filter((e: StoredVoiceSessionEntity) => {
                const data = JSON.parse(e.data);
                return data.voiceId === voiceId;
            })
            .map((e: StoredVoiceSessionEntity) => this.reconstitute(JSON.parse(e.data)));
    }

    async save(aggregate: VoiceSessionAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredVoiceSessionEntity = {
            id: aggregate.getSessionId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): VoiceSessionAggregate {
        const sessionId = VoiceSessionId.create(snapshot.sessionId);
        const voiceId = VoiceId.create(snapshot.voiceId);
        const profileId = VoiceProfileId.create(snapshot.profileId);
        const sessionState = VoiceSessionStateRef.create(snapshot.sessionState);
        return VoiceSessionAggregate.reconstitute(
            sessionId,
            voiceId,
            profileId,
            sessionState,
            snapshot.version,
            snapshot.startedAt,
            snapshot.endedAt,
            snapshot.totalAudioDurationMs,
            snapshot.text
        );
    }
}
