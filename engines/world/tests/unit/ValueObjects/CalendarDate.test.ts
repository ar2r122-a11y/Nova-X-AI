import { describe, it, expect } from "vitest";
import { CalendarDate } from "../../../src/Domain/ValueObjects/CalendarDate";

describe("CalendarDate", () => {
    it("test_creation_succeeds_with_valid_date", () => {
        const date = CalendarDate.create(2025, 6, 15);
        expect(date.getYear()).toBe(2025);
        expect(date.getMonth()).toBe(6);
        expect(date.getDay()).toBe(15);
    });

    it("test_creation_throws_with_invalid_year", () => {
        expect(() => CalendarDate.create(0, 1, 1)).toThrow();
    });

    it("test_creation_throws_with_invalid_month", () => {
        expect(() => CalendarDate.create(2025, 0, 1)).toThrow();
        expect(() => CalendarDate.create(2025, 13, 1)).toThrow();
    });

    it("test_creation_throws_with_invalid_day_for_month", () => {
        expect(() => CalendarDate.create(2025, 2, 30)).toThrow();
        expect(() => CalendarDate.create(2025, 2, 0)).toThrow();
    });

    it("test_add_days_calculates_correctly", () => {
        const date = CalendarDate.create(2025, 1, 1);
        const next = date.addDays(1);
        expect(next.getMonth()).toBe(1);
        expect(next.getDay()).toBe(2);
    });

    it("test_days_until_calculates_correctly", () => {
        const a = CalendarDate.create(2025, 1, 1);
        const b = CalendarDate.create(2025, 1, 5);
        expect(a.daysUntil(b)).toBe(4);
    });

    it("test_today_returns_current_date", () => {
        const today = CalendarDate.today();
        const now = new Date();
        expect(today.getYear()).toBe(now.getFullYear());
        expect(today.getMonth()).toBe(now.getMonth() + 1);
        expect(today.getDay()).toBe(now.getDate());
    });
});

