import { IQueryHandler } from "@nova-x-ai/core";
import type { ISpatialContextBuilder } from "../../Domain/Services/ISpatialContextBuilder";
import { GetSpatialContextQuery } from "../Queries/GetSpatialContextQuery";
import { SpatialContextDto } from "../DTO/SpatialContextDto";

export class GetSpatialContextQueryHandler implements IQueryHandler<GetSpatialContextQuery, SpatialContextDto> {
    constructor(private readonly spatialContextBuilder: ISpatialContextBuilder) {}

    async handle(query: GetSpatialContextQuery): Promise<SpatialContextDto> {
        const context = await this.spatialContextBuilder.buildContext(query.worldId, query.locationId, Date.now());
        return new SpatialContextDto(
            context.locationId,
            context.regionId,
            context.presentNpcs,
            {
                weather: context.environment.getWeather().getDescription(),
                timeOfDay: context.environment.getTimeOfDay().toString(),
                season: context.environment.getSeason().getValue(),
                visibilityKm: context.environment.getVisibilityKm(),
                ambientLightLevel: context.environment.getAmbientLightLevel()
            }
        );
    }
}
