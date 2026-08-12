import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceProfileRepository } from "../../Domain/Repositories/IVoiceProfileRepository";
import { ListVoiceProfilesQuery } from "../Queries/ListVoiceProfilesQuery";
import { VoiceProfileSummaryDto } from "../DTO/VoiceProfileSummaryDto";
import { VoiceProfile } from "../../Domain/Entities/VoiceProfile";

export class ListVoiceProfilesQueryHandler implements IQueryHandler<ListVoiceProfilesQuery, VoiceProfileSummaryDto[]> {
    constructor(private readonly profileRepository: IVoiceProfileRepository) {}

    async handle(query: ListVoiceProfilesQuery): Promise<VoiceProfileSummaryDto[]> {
        let profiles: VoiceProfile[];

        if (query.characterId) {
            const profile = await this.profileRepository.findByCharacterId(query.characterId);
            profiles = profile instanceof VoiceProfile ? [profile] : [];
        } else {
            profiles = await this.profileRepository.findAll();
        }

        return profiles.map((profile: VoiceProfile) => new VoiceProfileSummaryDto(
            profile.getProfileId().getValue(),
            profile.getCharacterId(),
            profile.getVoiceId(),
            profile.getLocale().getValue(),
            profile.getSpeakingRate(),
            profile.getConfigurationVersion()
        ));
    }
}
