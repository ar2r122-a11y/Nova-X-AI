import { IQueryHandler } from "@nova-x-ai/core";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import { ListRegionLocationsQuery } from "../Queries/ListRegionLocationsQuery";
import { RegionLocationsQueryResultDto } from "../DTO/RegionLocationsQueryResultDto";

export class ListRegionLocationsQueryHandler implements IQueryHandler<ListRegionLocationsQuery, RegionLocationsQueryResultDto> {
    constructor(private readonly regionRegistryRepository: IRegionRegistryRepository) {}

    async handle(query: ListRegionLocationsQuery): Promise<RegionLocationsQueryResultDto> {
        const { WorldId } = await import("../../Domain/ValueObjects/WorldId");
        const { RegionId } = await import("../../Domain/ValueObjects/RegionId");
        const worldId = WorldId.create(query.worldId);
        const aggregate = await this.regionRegistryRepository.findByWorldId(worldId);
        if (!aggregate) {
            throw new Error(`Region registry not found: ${query.worldId}`);
        }

        const region = aggregate.getRegion(RegionId.create(query.regionId));
        if (!region) {
            throw new Error(`Region not found: ${query.regionId}`);
        }

        const locations = aggregate.getAllLocations().filter(l => l.getRegionId().getValue() === query.regionId);
        const locationDtos = locations.map(l => ({
            id: l.getId().getValue(),
            name: l.getName(),
            description: l.getDescription(),
            coordinate: { x: l.getCoordinate().getX(), y: l.getCoordinate().getY(), z: l.getCoordinate().getZ() },
            capacity: l.getCapacity(),
            presentNpcs: [] as string[]
        }));

        return new RegionLocationsQueryResultDto(query.regionId, locationDtos);
    }
}
