import { describe, it, expect } from "vitest";
import { WorldStateQueryResultDto } from "../../../src/Application/DTO/WorldStateQueryResultDto";
import { WorldClockQueryResultDto } from "../../../src/Application/DTO/WorldClockQueryResultDto";
import { WorldTimelineDto } from "../../../src/Application/DTO/WorldTimelineDto";
import { RegionLocationsQueryResultDto } from "../../../src/Application/DTO/RegionLocationsQueryResultDto";
import { NpcPresenceQueryResultDto } from "../../../src/Application/DTO/NpcPresenceQueryResultDto";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";
import { CalendarDate } from "../../../src/Domain/ValueObjects/CalendarDate";
import { SeasonRef } from "../../../src/Domain/ValueObjects/Season";

describe("WorldStateQueryResultDto", () => {
    it("test_dto_constructed_with_correct_properties", () => {
        const dto = new WorldStateQueryResultDto("world-1", "active", 1, 2, 5);
        expect(dto.worldId).toBe("world-1");
        expect(dto.state).toBe("active");
        expect(dto.version).toBe(1);
        expect(dto.regionCount).toBe(2);
        expect(dto.globalVariableCount).toBe(5);
    });
});

describe("WorldClockQueryResultDto", () => {
    it("test_dto_constructed_with_correct_properties", () => {
        const dto = new WorldClockQueryResultDto("12:00:00", "2024-01-15", "summer", 0);
        expect(dto.currentTime).toBe("12:00:00");
        expect(dto.currentDate).toBe("2024-01-15");
        expect(dto.currentSeason).toBe("summer");
        expect(dto.tickCount).toBe(0);
    });

    it("test_fromClock_static_method_creates_dto", () => {
        const clock = {
            getTimeOfDay: () => TimeOfDay.noon(),
            getCalendarDate: () => CalendarDate.create(2024, 1, 15),
            getSeason: () => SeasonRef.summer(),
            getTickCount: () => 5
        };
        const dto = WorldClockQueryResultDto.fromClock(clock as any);
        expect(dto).toBeInstanceOf(WorldClockQueryResultDto);
        expect(dto.currentTime).toBe("12:00:00");
        expect(dto.currentDate).toBe("2024-01-15");
        expect(dto.currentSeason).toBe("summer");
        expect(dto.tickCount).toBe(5);
    });
});

describe("WorldTimelineDto", () => {
    it("test_dto_constructed_with_correct_properties", () => {
        const dto = new WorldTimelineDto("12:00:00", "2024-01-15", "summer", 0);
        expect(dto.currentTime).toBe("12:00:00");
        expect(dto.currentDate).toBe("2024-01-15");
        expect(dto.currentSeason).toBe("summer");
        expect(dto.tickCount).toBe(0);
    });

    it("test_fromClock_static_method_creates_dto", () => {
        const clock = {
            getTimeOfDay: () => TimeOfDay.noon(),
            getCalendarDate: () => CalendarDate.create(2024, 1, 15),
            getSeason: () => SeasonRef.summer(),
            getTickCount: () => 5
        };
        const dto = WorldTimelineDto.fromClock(clock as any);
        expect(dto).toBeInstanceOf(WorldTimelineDto);
        expect(dto.currentTime).toBe("12:00:00");
        expect(dto.currentDate).toBe("2024-01-15");
        expect(dto.currentSeason).toBe("summer");
        expect(dto.tickCount).toBe(5);
    });
});

describe("RegionLocationsQueryResultDto", () => {
    it("test_dto_constructed_with_correct_properties", () => {
        const locations = [
            {
                id: "loc-1",
                name: "Test Location",
                description: "A test location",
                coordinate: { x: 0, y: 0, z: 0 },
                capacity: 10,
                presentNpcs: [] as string[]
            }
        ];
        const dto = new RegionLocationsQueryResultDto("region-1", locations);
        expect(dto.regionId).toBe("region-1");
        expect(dto.locations).toHaveLength(1);
        expect(dto.locations[0].id).toBe("loc-1");
        expect(dto.locations[0].name).toBe("Test Location");
    });
});

describe("NpcPresenceQueryResultDto", () => {
    it("test_dto_constructed_with_correct_properties", () => {
        const dto = new NpcPresenceQueryResultDto("loc-1", ["char-1", "char-2"], 1234567890);
        expect(dto.locationId).toBe("loc-1");
        expect(dto.presentNpcs).toEqual(["char-1", "char-2"]);
        expect(dto.timestamp).toBe(1234567890);
    });
});
