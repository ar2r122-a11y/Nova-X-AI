import { describe, it, expect } from "vitest";
import { TimeOfDay } from "../../../src/Domain/ValueObjects/TimeOfDay";

describe("TimeOfDay", () => {
    it("test_creation_succeeds_with_valid_time", () => {
        const time = TimeOfDay.create(12, 30, 45);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(30);
        expect(time.getSeconds()).toBe(45);
    });

    it("test_creation_throws_with_invalid_hours", () => {
        expect(() => TimeOfDay.create(-1, 0, 0)).toThrow();
        expect(() => TimeOfDay.create(24, 0, 0)).toThrow();
    });

    it("test_creation_throws_with_invalid_minutes", () => {
        expect(() => TimeOfDay.create(12, -1, 0)).toThrow();
        expect(() => TimeOfDay.create(12, 60, 0)).toThrow();
    });

    it("test_creation_throws_with_invalid_seconds", () => {
        expect(() => TimeOfDay.create(12, 0, -1)).toThrow();
        expect(() => TimeOfDay.create(12, 0, 60)).toThrow();
    });

    it("test_total_seconds_calculated_correctly", () => {
        expect(TimeOfDay.create(1, 0, 0).getTotalSeconds()).toBe(3600);
        expect(TimeOfDay.create(0, 1, 0).getTotalSeconds()).toBe(60);
        expect(TimeOfDay.create(0, 0, 1).getTotalSeconds()).toBe(1);
    });

    it("test_add_seconds_wraps_past_midnight", () => {
        const time = TimeOfDay.create(23, 59, 30);
        const next = time.addSeconds(60);
        expect(next.getHours()).toBe(0);
        expect(next.getMinutes()).toBe(0);
        expect(next.getSeconds()).toBe(30);
    });

    it("test_midnight_and_noon_static_methods", () => {
        expect(TimeOfDay.midnight().getHours()).toBe(0);
        expect(TimeOfDay.noon().getHours()).toBe(12);
    });
});

