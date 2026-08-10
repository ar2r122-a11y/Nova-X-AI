import { describe, it, expect } from "vitest";
import { WeatherCondition } from "../../../src/Domain/ValueObjects/WeatherCondition";

describe("WeatherCondition", () => {
    it("test_creation_succeeds_with_valid_conditions", () => {
        const weather = WeatherCondition.create(20.0, 5.0, 15.0, 80.0, "light rain");
        expect(weather.getTemperatureCelsius()).toBe(20.0);
        expect(weather.getPrecipitationMm()).toBe(5.0);
        expect(weather.getWindSpeedKmh()).toBe(15.0);
        expect(weather.getCloudCoverPercent()).toBe(80.0);
        expect(weather.getDescription()).toBe("light rain");
    });

    it("test_creation_throws_with_negative_precipitation", () => {
        expect(() => WeatherCondition.create(20.0, -1.0, 15.0, 80.0, "rain")).toThrow();
    });

    it("test_creation_throws_with_negative_wind_speed", () => {
        expect(() => WeatherCondition.create(20.0, 5.0, -1.0, 80.0, "rain")).toThrow();
    });

    it("test_creation_throws_with_invalid_cloud_cover", () => {
        expect(() => WeatherCondition.create(20.0, 5.0, 15.0, -1.0, "rain")).toThrow();
        expect(() => WeatherCondition.create(20.0, 5.0, 15.0, 101.0, "rain")).toThrow();
    });

    it("test_creation_throws_with_empty_description", () => {
        expect(() => WeatherCondition.create(20.0, 5.0, 15.0, 80.0, "")).toThrow();
        expect(() => WeatherCondition.create(20.0, 5.0, 15.0, 80.0, "   ")).toThrow();
    });

    it("test_is_precipitating_returns_true_when_rain", () => {
        expect(WeatherCondition.rain().isPrecipitating()).toBe(true);
        expect(WeatherCondition.clear().isPrecipitating()).toBe(false);
    });

    it("test_is_windy_returns_true_when_wind_above_threshold", () => {
        const windy = WeatherCondition.create(20.0, 0.0, 30.0, 50.0, "windy");
        expect(windy.isWindy()).toBe(true);
        expect(WeatherCondition.clear().isWindy()).toBe(false);
    });
});

