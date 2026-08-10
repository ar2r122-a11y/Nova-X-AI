import { IQueryHandler } from "@nova-x-ai/core";
import type { IWorldRepository } from "../../Domain/Repositories/IWorldRepository";
import { GetWorldStateQuery } from "../Queries/GetWorldStateQuery";
import { WorldAggregateDto } from "../DTO/WorldAggregateDto";

export class GetWorldStateQueryHandler implements IQueryHandler<GetWorldStateQuery, WorldAggregateDto> {
    constructor(private readonly worldRepository: IWorldRepository) {}

    async handle(query: GetWorldStateQuery): Promise<WorldAggregateDto> {
        const { WorldId } = await import("../../Domain/ValueObjects/WorldId");
        const worldId = WorldId.create(query.worldId);
        const aggregate = await this.worldRepository.findById(worldId);
        if (!aggregate) {
            throw new Error(`World not found: ${query.worldId}`);
        }
        return WorldAggregateDto.fromAggregate(aggregate as any);
    }
}
