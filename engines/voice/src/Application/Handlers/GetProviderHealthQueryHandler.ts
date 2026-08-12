import { IQueryHandler } from "@nova-x-ai/core";
import type { IVoiceRepository } from "../../Domain/Repositories/IVoiceRepository";
import { GetProviderHealthQuery } from "../Queries/GetProviderHealthQuery";
import { ProviderHealthDto } from "../DTO/ProviderHealthDto";

export class GetProviderHealthQueryHandler implements IQueryHandler<GetProviderHealthQuery, ProviderHealthDto> {
    constructor(private readonly voiceRepository: IVoiceRepository) {}

    async handle(query: GetProviderHealthQuery): Promise<ProviderHealthDto> {
        const { VoiceId } = await import("../../Domain/ValueObjects/VoiceId");
        const { VoiceProviderId } = await import("../../Domain/ValueObjects/VoiceProviderId");
        const voiceId = VoiceId.create(query.providerId);
        const aggregate = await this.voiceRepository.findById(voiceId);
        if (!aggregate) {
            return new ProviderHealthDto(
                query.providerId,
                "healthy",
                0,
                Date.now(),
                0,
                0
            );
        }
        return new ProviderHealthDto(
            aggregate.getProviderId().getValue(),
            aggregate.getConsecutiveFailures() > 0 ? "unhealthy" : "healthy",
            0,
            Date.now(),
            aggregate.getConsecutiveFailures(),
            100 - aggregate.getConsecutiveFailures()
        );
    }
}
