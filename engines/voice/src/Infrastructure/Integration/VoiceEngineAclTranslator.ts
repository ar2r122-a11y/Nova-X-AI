import { VoiceProfile } from "../../Domain/Entities/VoiceProfile";

export class VoiceEngineAclTranslator {
    translateVoiceProfileToAcl(profile: VoiceProfile): Record<string, unknown> {
        return {
            profileId: profile.getProfileId().getValue(),
            characterId: profile.getCharacterId(),
            voiceId: profile.getVoiceId(),
            locale: profile.getLocale().getValue(),
            speakingRate: profile.getSpeakingRate(),
            configurationVersion: profile.getConfigurationVersion()
        };
    }
}
