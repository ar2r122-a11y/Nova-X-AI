import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IVoiceProfileRepository } from "../../Domain/Repositories/IVoiceProfileRepository";
import { VoiceProfile } from "../../Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../Domain/ValueObjects/VoiceLocale";

interface StoredVoiceProfileEntity {
    id: string;
    data: string;
}

export class VoiceProfileRepositoryImpl implements IVoiceProfileRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredVoiceProfileEntity | null>;
        save(entity: StoredVoiceProfileEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredVoiceProfileEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredVoiceProfileEntity>("voice-profiles");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findById(profileId: VoiceProfileId): Promise<VoiceProfile | null> {
        const entity = await this.storageRepository.getById(profileId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async findByCharacterId(characterId: string): Promise<VoiceProfile | null> {
        const all = await this.storageRepository.getAll();
        const found = all.find((e: StoredVoiceProfileEntity) => {
            const data = JSON.parse(e.data);
            return data.characterId === characterId;
        });
        if (!found) {
            return null;
        }
        return this.reconstitute(JSON.parse(found.data));
    }

    async findAll(): Promise<VoiceProfile[]> {
        const all = await this.storageRepository.getAll();
        return all.map((e: StoredVoiceProfileEntity) => this.reconstitute(JSON.parse(e.data)));
    }

    async save(profile: VoiceProfile): Promise<void> {
        const snapshot = profile.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredVoiceProfileEntity = {
            id: profile.getProfileId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async delete(profileId: VoiceProfileId): Promise<void> {
        await this.storageRepository.delete(profileId.getValue());
    }

    private reconstitute(snapshot: any): VoiceProfile {
        const profileId = VoiceProfileId.create(snapshot.profileId);
        const locale = VoiceLocale.create(snapshot.locale);
        return VoiceProfile.reconstitute(
            profileId,
            snapshot.characterId,
            snapshot.voiceId,
            snapshot.speakingRate,
            snapshot.pitchModifier,
            snapshot.supportedParameters,
            snapshot.modelMetadata,
            snapshot.providerCapabilityMetadata,
            locale,
            snapshot.configurationVersion,
            snapshot.createdAt,
            snapshot.updatedAt
        );
    }
}
