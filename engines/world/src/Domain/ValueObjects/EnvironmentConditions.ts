import { SeasonRef } from "./Season";
import { TimeOfDay } from "./TimeOfDay";
import { WeatherCondition } from "./WeatherCondition";

export class EnvironmentConditions {
    private readonly weather: WeatherCondition;
    private readonly timeOfDay: TimeOfDay;
    private readonly season: SeasonRef;
    private readonly visibilityKm: number;
    private readonly ambientLightLevel: number;

    private constructor(
        weather: WeatherCondition,
        timeOfDay: TimeOfDay,
        season: SeasonRef,
        visibilityKm: number,
        ambientLightLevel: number
    ) {
        this.weather = weather;
        this.timeOfDay = timeOfDay;
        this.season = season;
        this.visibilityKm = visibilityKm;
        this.ambientLightLevel = ambientLightLevel;
    }

    static create(
        weather: WeatherCondition,
        timeOfDay: TimeOfDay,
        season: SeasonRef,
        visibilityKm: number,
        ambientLightLevel: number
    ): EnvironmentConditions {
        if (visibilityKm < 0) {
            throw new Error("Visibility cannot be negative.");
        }
        if (ambientLightLevel < 0 || ambientLightLevel > 1.0) {
            throw new Error("Ambient light level must be between 0 and 1.");
        }
        return new EnvironmentConditions(weather, timeOfDay, season, visibilityKm, ambientLightLevel);
    }

    static default(): EnvironmentConditions {
        return EnvironmentConditions.create(
            WeatherCondition.clear(),
            TimeOfDay.noon(),
            SeasonRef.summer(),
            10.0,
            0.8
        );
    }

    getWeather(): WeatherCondition {
        return this.weather;
    }

    getTimeOfDay(): TimeOfDay {
        return this.timeOfDay;
    }

    getSeason(): SeasonRef {
        return this.season;
    }

    getVisibilityKm(): number {
        return this.visibilityKm;
    }

    getAmbientLightLevel(): number {
        return this.ambientLightLevel;
    }

    withWeather(weather: WeatherCondition): EnvironmentConditions {
        return new EnvironmentConditions(weather, this.timeOfDay, this.season, this.visibilityKm, this.ambientLightLevel);
    }

    withTimeOfDay(timeOfDay: TimeOfDay): EnvironmentConditions {
        return new EnvironmentConditions(this.weather, timeOfDay, this.season, this.visibilityKm, this.ambientLightLevel);
    }

    withSeason(season: SeasonRef): EnvironmentConditions {
        return new EnvironmentConditions(this.weather, this.timeOfDay, season, this.visibilityKm, this.ambientLightLevel);
    }

    equals(other: EnvironmentConditions): boolean {
        return (
            this.weather.equals(other.weather) &&
            this.timeOfDay.equals(other.timeOfDay) &&
            this.season.equals(other.season) &&
            this.visibilityKm === other.visibilityKm &&
            this.ambientLightLevel === other.ambientLightLevel
        );
    }
}
