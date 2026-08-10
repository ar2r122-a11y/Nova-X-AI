import { describe, it, expect } from "vitest";
import { WeatherChangedEvent } from "../../../src/Domain/Events/WeatherChangedEvent";

describe("WeatherChangedEvent", () => {
    it("test_creation_sets_properties_correctly", () => {
        const event = new WeatherChangedEvent("world-1", "region-1", "clear", "rain", 20.0, 15.0, 1000, "corr-1");
        expect(event.eventType).toBe("EVT_WORLD_WeatherChanged");
        expect(event.worldId).toBe("world-1");
        expect(event.regionId).toBe("region-1");
        expect(event.previousWeather).toBe("clear");
        expect(event.newWeather).toBe("rain");
        expect(event.previousTemperature).toBe(20.0);
        expect(event.newTemperature).toBe(15.0);
    });
});

