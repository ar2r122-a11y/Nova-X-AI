import { IQueryHandler } from "@nova-x-ai/core";
import type { IWorldClockRepository } from "../../Domain/Repositories/IWorldClockRepository";
import { GetWorldClockQuery } from "../Queries/GetWorldClockQuery";
import { WorldTimelineDto } from "../DTO/WorldTimelineDto";

export class GetWorldClockQueryHandler implements IQueryHandler<GetWorldClockQuery, WorldTimelineDto> {
    constructor(private readonly clockRepository: IWorldClockRepository) {}

    async handle(query: GetWorldClockQuery): Promise<WorldTimelineDto> {
        const { WorldId } = await import("../../Domain/ValueObjects/WorldId");
        const worldId = WorldId.create(query.worldId);
        const aggregate = await this.clockRepository.findByWorldId(worldId);
        if (!aggregate) {
            throw new Error(`World clock not found: ${query.worldId}`);
        }
        return WorldTimelineDto.fromClock(aggregate as any);
    }
}
