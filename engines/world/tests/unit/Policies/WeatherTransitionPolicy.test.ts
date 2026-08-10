import { describe, it, expect } from "vitest";
import { WeatherTransitionPolicy } from "../../../src/Domain/Policies/WeatherTransitionPolicy";
import { WeatherCondition } from "../../../src/Domain/ValueObjects/WeatherCondition";

describe("WeatherTransitionPolicy", () => {
    it("test_allows_small_temperature_change", () => {
        const from = WeatherCondition.create(20.0, 0.0, 5.0, 50.0, "clear");
        const to = WeatherCondition.create(23.0, 0.0, 5.0, 50.0, "clear");
        expect(WeatherTransitionPolicy.canTransition(from, to)).toBe(true);
    });

    it("test_denies_large_temperature_change", () => {
        const from = WeatherCondition.create(20.0, 0.0, 5.0, 50.0, "clear");
        const to = WeatherCondition.create(30.0, 0.0, 5.0, 50.0, "clear");
        expect(WeatherTransitionPolicy.canTransition(from, to)).toBe(false);
    });

    it("test_denies_large_precipitation_change", () => {
        const from = WeatherCondition.create(20.0, 0.0, 5.0, 50.0, "clear");
        const to = WeatherCondition.create(20.0, 20.0, 5.0, 50.0, "rain");
        expect(WeatherTransitionPolicy.canTransition(from, to)).toBe(false);
    });
});

