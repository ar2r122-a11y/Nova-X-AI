import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceProfileRepository } from "../../Domain/Repositories/IVoiceProfileRepository";
import { GetVoiceProfileQuery } from "../Queries/GetVoiceProfileQuery";
import { VoiceProfileDto } from "../DTO/VoiceProfileDto";

export class GetVoiceProfileQueryHandler implements IQueryHandler<GetVoiceProfileQuery, VoiceProfileDto> {
    constructor(private readonly profileRepository: IVoiceProfileRepository) {}

    async handle(query: GetVoiceProfileQuery): Promise<VoiceProfileDto> {
        const { VoiceProfileId } = await import("../../Domain/ValueObjects/VoiceProfileId");
        const profileId = VoiceProfileId.create(query.profileId);
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new Error(`Voice profile not found: ${query.profileId}`);
        }
        return VoiceProfileDto.fromProfile(profile as any);
    }
}
