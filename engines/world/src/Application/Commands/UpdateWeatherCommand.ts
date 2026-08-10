import { ICommand } from "@nova-x-ai/core";

export class UpdateWeatherCommand implements ICommand {
    constructor(
        public readonly worldId: string,
        public readonly regionId: string,
        public readonly conditions: {
            temperatureCelsius: number;
            precipitationMm: number;
            windSpeedKmh: number;
            cloudCoverPercent: number;
            description: string;
        },
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
