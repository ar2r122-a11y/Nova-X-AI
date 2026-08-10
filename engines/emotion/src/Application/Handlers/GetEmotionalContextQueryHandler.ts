import { IQueryHandler } from "@nova-x-ai/core";
import { GetEmotionalContextQuery } from "../Queries/GetEmotionalContextQuery";
import { EmotionalContextDto } from "../DTO/EmotionalContextDto";
import { EmotionNotFoundException } from "../../Domain/Exceptions";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class GetEmotionalContextQueryHandler implements IQueryHandler<GetEmotionalContextQuery, EmotionalContextDto> {
    constructor(private readonly repository: IEmotionRepository) {}

    async handle(query: GetEmotionalContextQuery): Promise<EmotionalContextDto> {
        const snapshot = await this.repository.findByCharacterId(query.characterId);
        if (!snapshot) {
            throw new EmotionNotFoundException(query.characterId);
        }
        return EmotionalContextDto.fromAggregate(snapshot);
    }
}
