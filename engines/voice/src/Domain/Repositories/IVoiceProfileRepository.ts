import { VoiceProfile } from "../../Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../Domain/ValueObjects/VoiceProfileId";

export interface IVoiceProfileRepository {
    findById(profileId: VoiceProfileId): Promise<VoiceProfile | null>;
    findByCharacterId(characterId: string): Promise<VoiceProfile | null>;
    findAll(): Promise<VoiceProfile[]>;
    save(profile: VoiceProfile): Promise<void>;
    delete(profileId: VoiceProfileId): Promise<void>;
}
