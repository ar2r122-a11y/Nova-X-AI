import { LocationId } from "../../Domain/ValueObjects/LocationId";

export class SpatialContextDto {
    constructor(
        public readonly locationId: string,
        public readonly regionId: string,
        public readonly presentNpcs: string[],
        public readonly environment: {
            weather: string;
            timeOfDay: string;
            season: string;
            visibilityKm: number;
            ambientLightLevel: number;
        }
    ) {}
}
