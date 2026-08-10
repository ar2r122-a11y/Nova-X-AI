export interface IEnvironmentalSimulationService {
    updateWeather(worldId: string, regionId: string, conditions: import("../ValueObjects/WeatherCondition").WeatherCondition): Promise<void>;
    getCurrentConditions(worldId: string, regionId: string): Promise<import("../ValueObjects/EnvironmentConditions").EnvironmentConditions>;
    simulateEnvironmentalShift(worldId: string): Promise<import("../ValueObjects/EnvironmentConditions").EnvironmentConditions>;
}
