import { IQueryHandler } from "@nova-x-ai/core";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import { GetNpcPresenceQuery } from "../Queries/GetNpcPresenceQuery";
import { NpcPresenceQueryResultDto } from "../DTO/NpcPresenceQueryResultDto";

export class GetNpcPresenceQueryHandler implements IQueryHandler<GetNpcPresenceQuery, NpcPresenceQueryResultDto> {
    constructor(private readonly regionRegistryRepository: IRegionRegistryRepository) {}

    async handle(query: GetNpcPresenceQuery): Promise<NpcPresenceQueryResultDto> {
        const { WorldId } = await import("../../Domain/ValueObjects/WorldId");
        const { LocationId } = await import("../../Domain/ValueObjects/LocationId");
        const worldId = WorldId.create(query.worldId);
        const aggregate = await this.regionRegistryRepository.findByWorldId(worldId);
        if (!aggregate) {
            throw new Error(`Region registry not found: ${query.worldId}`);
        }

        const timestamp = query.timestamp ?? Date.now();
        const npcs = aggregate.getNpcPresenceAtLocation(LocationId.create(query.locationId), timestamp);

        return new NpcPresenceQueryResultDto(query.locationId, [...npcs], timestamp);
    }
}
