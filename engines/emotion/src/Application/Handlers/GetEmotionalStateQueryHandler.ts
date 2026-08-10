import { IQueryHandler } from "@nova-x-ai/core";
import { GetEmotionalStateQuery } from "../Queries/GetEmotionalStateQuery";
import { EmotionalSnapshotDto } from "../DTO/EmotionalSnapshotDto";
import { EmotionNotFoundException } from "../../Domain/Exceptions";
import type { IEmotionRepository } from "../../Domain/Repositories/IEmotionRepository";

export class GetEmotionalStateQueryHandler implements IQueryHandler<GetEmotionalStateQuery, EmotionalSnapshotDto> {
    constructor(private readonly repository: IEmotionRepository) {}

    async handle(query: GetEmotionalStateQuery): Promise<EmotionalSnapshotDto> {
        const snapshot = await this.repository.findByCharacterId(query.characterId);
        if (!snapshot) {
            throw new EmotionNotFoundException(query.characterId);
        }
        return EmotionalSnapshotDto.fromAggregate(snapshot);
    }
}
