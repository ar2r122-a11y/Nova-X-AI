export class RegionLocationsQueryResultDto {
    constructor(
        public readonly regionId: string,
        public readonly locations: {
            id: string;
            name: string;
            description: string;
            coordinate: { x: number; y: number; z: number };
            capacity: number;
            presentNpcs: string[];
        }[]
    ) {}
}
