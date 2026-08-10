import { describe, it, expect } from "vitest";
import { EnvironmentConditions } from "../../../src/Domain/ValueObjects/EnvironmentConditions";
import { WeatherCondition } from "../../../src/Domain/ValueObjects/WeatherCondition";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";
import { SeasonRef } from "../../../src/Domain/ValueObjects/Season";

describe("EnvironmentConditions", () => {
    it("test_creation_succeeds_with_valid_conditions", () => {
        const env = EnvironmentConditions.create(
            WeatherCondition.create(20.0, 5.0, 15.0, 80.0, "rain"),
            TimeOfDay.noon(),
            SeasonRef.summer(),
            10.0,
            0.8
        );
        expect(env.getWeather().getDescription()).toBe("rain");
        expect(env.getSeason().getValue()).toBe("summer");
        expect(env.getVisibilityKm()).toBe(10.0);
        expect(env.getAmbientLightLevel()).toBe(0.8);
    });

    it("test_creation_throws_with_negative_visibility", () => {
        expect(() => EnvironmentConditions.create(WeatherCondition.clear(), TimeOfDay.noon(), SeasonRef.summer(), -1.0, 0.8)).toThrow();
    });

    it("test_creation_throws_with_invalid_ambient_light", () => {
        expect(() => EnvironmentConditions.create(WeatherCondition.clear(), TimeOfDay.noon(), SeasonRef.summer(), 10.0, -0.1)).toThrow();
        expect(() => EnvironmentConditions.create(WeatherCondition.clear(), TimeOfDay.noon(), SeasonRef.summer(), 10.0, 1.1)).toThrow();
    });

    it("test_with_weather_returns_new_instance_with_different_weather", () => {
        const env = EnvironmentConditions.default();
        const updated = env.withWeather(WeatherCondition.rain());
        expect(updated.getWeather().getDescription()).toBe("rain");
        expect(updated.getSeason().getValue()).toBe(env.getSeason().getValue());
    });
});

