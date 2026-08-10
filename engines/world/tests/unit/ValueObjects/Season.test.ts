import { describe, it, expect } from "vitest";
import { SeasonRef } from "../../../src/Domain/ValueObjects/Season";
import { CalendarDate } from "../../../src/Domain/ValueObjects/CalendarDate";

describe("SeasonRef", () => {
    it("test_creation_succeeds_with_valid_seasons", () => {
        expect(SeasonRef.create("spring").getValue()).toBe("spring");
        expect(SeasonRef.summer().getValue()).toBe("summer");
        expect(SeasonRef.autumn().getValue()).toBe("autumn");
        expect(SeasonRef.winter().getValue()).toBe("winter");
    });

    it("test_creation_throws_with_invalid_season", () => {
        expect(() => SeasonRef.create("monsoon" as any)).toThrow();
    });

    it("test_from_calendar_date_returns_correct_season_northern_hemisphere", () => {
        const jan = CalendarDate.create(2025, 1, 15);
        const apr = CalendarDate.create(2025, 4, 15);
        const jul = CalendarDate.create(2025, 7, 15);
        const oct = CalendarDate.create(2025, 10, 15);
        expect(SeasonRef.fromCalendarDate(jan, true).getValue()).toBe("winter");
        expect(SeasonRef.fromCalendarDate(apr, true).getValue()).toBe("spring");
        expect(SeasonRef.fromCalendarDate(jul, true).getValue()).toBe("summer");
        expect(SeasonRef.fromCalendarDate(oct, true).getValue()).toBe("autumn");
    });

    it("test_from_calendar_date_returns_correct_season_southern_hemisphere", () => {
        const jan = CalendarDate.create(2025, 1, 15);
        const jul = CalendarDate.create(2025, 7, 15);
        expect(SeasonRef.fromCalendarDate(jan, false).getValue()).toBe("summer");
        expect(SeasonRef.fromCalendarDate(jul, false).getValue()).toBe("winter");
    });
});

