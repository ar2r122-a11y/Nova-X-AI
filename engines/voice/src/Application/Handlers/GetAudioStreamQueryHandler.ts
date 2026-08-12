import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceRepository } from "../../Domain/Repositories/IVoiceRepository";
import { GetAudioStreamQuery } from "../Queries/GetAudioStreamQuery";
import { AudioStreamDto } from "../DTO/AudioStreamDto";

export class GetAudioStreamQueryHandler implements IQueryHandler<GetAudioStreamQuery, AudioStreamDto> {
    constructor(private readonly voiceRepository: IVoiceRepository) {}

    async handle(query: GetAudioStreamQuery): Promise<AudioStreamDto> {
        const { VoiceId } = await import("../../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(query.streamId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            throw new Error(`Audio stream not found: ${query.streamId}`);
        }
        return AudioStreamDto.fromAggregate(aggregate as any);
    }
}
