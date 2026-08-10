import { IQueryHandler } from "@nova-x-ai/core";
import { GetEmotionalHistoryQuery } from "../Queries/GetEmotionalHistoryQuery";
import { EmotionalHistoryDto } from "../DTO/EmotionalHistoryDto";
import { EmotionNotFoundException } from "../../Domain/Exceptions";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class GetEmotionalHistoryQueryHandler implements IQueryHandler<GetEmotionalHistoryQuery, EmotionalHistoryDto> {
    constructor(private readonly repository: IEmotionRepository) {}

    async handle(query: GetEmotionalHistoryQuery): Promise<EmotionalHistoryDto> {
        const snapshot = await this.repository.findByCharacterId(query.characterId);
        if (!snapshot) {
            throw new EmotionNotFoundException(query.characterId);
        }
        return EmotionalHistoryDto.fromAggregate(snapshot);
    }
}
