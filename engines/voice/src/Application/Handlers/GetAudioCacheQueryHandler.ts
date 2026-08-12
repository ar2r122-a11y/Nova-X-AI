import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceRepository } from "../../Domain/Repositories/IVoiceRepository";
import { GetAudioCacheQuery } from "../Queries/GetAudioCacheQuery";
import { AudioCacheDto } from "../DTO/AudioCacheDto";

export class GetAudioCacheQueryHandler implements IQueryHandler<GetAudioCacheQuery, AudioCacheDto> {
    constructor(private readonly voiceRepository: IVoiceRepository) {}

    async handle(query: GetAudioCacheQuery): Promise<AudioCacheDto> {
        const { VoiceId } = await import("../../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(query.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            return new AudioCacheDto(query.voiceId, 0, 0, null);
        }
        return new AudioCacheDto(
            query.voiceId,
            aggregate.getTotalChunksProcessed(),
            0,
            Date.now()
        );
    }
}
