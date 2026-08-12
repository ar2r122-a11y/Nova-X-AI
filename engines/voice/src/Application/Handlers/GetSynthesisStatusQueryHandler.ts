import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceRepository } from "../../Domain/Repositories/IVoiceRepository";
import { GetSynthesisStatusQuery } from "../Queries/GetSynthesisStatusQuery";
import { VoiceSynthesisResultDto } from "../DTO/VoiceSynthesisResultDto";

export class GetSynthesisStatusQueryHandler implements IQueryHandler<GetSynthesisStatusQuery, VoiceSynthesisResultDto> {
    constructor(private readonly voiceRepository: IVoiceRepository) {}

    async handle(query: GetSynthesisStatusQuery): Promise<VoiceSynthesisResultDto> {
        const { VoiceId } = await import("../../Domain/ValueObjects/VoiceId");
        const voiceId = VoiceId.create(query.voiceId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            throw new Error(`Voice not found: ${query.voiceId}`);
        }
        return new VoiceSynthesisResultDto(
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
}
