import { WeatherCondition } from "../ValueObjects/WeatherCondition";

export class WeatherTransitionPolicy {
    private static readonly MAX_TEMPERATURE_CHANGE_PER_TICK = 5.0;
    private static readonly MAX_PRECIPITATION_CHANGE_PER_TICK = 10.0;

    static canTransition(from: WeatherCondition, to: WeatherCondition): boolean {
        const temperatureDelta = Math.abs(to.getTemperatureCelsius() - from.getTemperatureCelsius());
        const precipitationDelta = Math.abs(to.getPrecipitationMm() - from.getPrecipitationMm());

        if (temperatureDelta > WeatherTransitionPolicy.MAX_TEMPERATURE_CHANGE_PER_TICK) {
            return false;
        }
        if (precipitationDelta > WeatherTransitionPolicy.MAX_PRECIPITATION_CHANGE_PER_TICK) {
            return false;
        }
        return true;
    }
}
