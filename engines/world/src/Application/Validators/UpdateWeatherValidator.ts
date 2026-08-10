import { UpdateWeatherCommand } from "../Commands/UpdateWeatherCommand";

export class UpdateWeatherValidator {
    validate(command: UpdateWeatherCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (!command.regionId || command.regionId.trim().length === 0) {
            throw new Error("RegionId is required.");
        }
        if (command.conditions.cloudCoverPercent < 0 || command.conditions.cloudCoverPercent > 100) {
            throw new Error("Cloud cover percent must be between 0 and 100.");
        }
        if (command.conditions.precipitationMm < 0) {
            throw new Error("Precipitation cannot be negative.");
        }
        if (command.conditions.windSpeedKmh < 0) {
            throw new Error("Wind speed cannot be negative.");
        }
        if (!command.conditions.description || command.conditions.description.trim().length === 0) {
            throw new Error("Weather description cannot be empty.");
        }
    }
}
