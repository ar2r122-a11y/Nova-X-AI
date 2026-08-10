export class EnvironmentPayload {
    constructor(
        public readonly temperatureCelsius: number,
        public readonly precipitationMm: number,
        public readonly windSpeedKmh: number,
        public readonly cloudCoverPercent: number,
        public readonly description: string,
        public readonly visibilityKm: number,
        public readonly ambientLightLevel: number
    ) {}

    static fromConditions(conditions: {
        getWeather(): { getTemperatureCelsius(): number; getPrecipitationMm(): number; getWindSpeedKmh(): number; getCloudCoverPercent(): number; getDescription(): string };
        getVisibilityKm(): number;
        getAmbientLightLevel(): number;
    }): EnvironmentPayload {
        return new EnvironmentPayload(
            conditions.getWeather().getTemperatureCelsius(),
            conditions.getWeather().getPrecipitationMm(),
            conditions.getWeather().getWindSpeedKmh(),
            conditions.getWeather().getCloudCoverPercent(),
            conditions.getWeather().getDescription(),
            conditions.getVisibilityKm(),
            conditions.getAmbientLightLevel()
        );
    }
}
