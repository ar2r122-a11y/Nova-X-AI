export class ProjectionReadModelDto {
    constructor(
        public readonly worldId: string,
        public readonly state: string,
        public readonly regions: { id: string; name: string; locationCount: number }[],
        public readonly timeline: {
            currentTime: string;
            currentDate: string;
            currentSeason: string;
            tickCount: number;
        },
        public readonly environment: {
            temperatureCelsius: number;
            precipitationMm: number;
            windSpeedKmh: number;
            cloudCoverPercent: number;
            description: string;
        },
        public readonly lastUpdated: number
    ) {}
}
