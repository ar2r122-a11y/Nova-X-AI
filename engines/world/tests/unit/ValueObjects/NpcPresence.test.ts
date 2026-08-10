import { describe, it, expect } from "vitest";
import { NpcPresence } from "../../../src/Domain/ValueObjects/NpcPresence";

describe("NpcPresence", () => {
    it("test_creation_succeeds_with_valid_presence", () => {
        const presence = NpcPresence.create("char-1", "loc-1", 1000, 2000);
        expect(presence.getCharacterId()).toBe("char-1");
        expect(presence.getLocationId()).toBe("loc-1");
        expect(presence.getArrivedAt()).toBe(1000);
        expect(presence.getScheduledDeparture()).toBe(2000);
    });

    it("test_creation_throws_with_empty_character_id", () => {
        expect(() => NpcPresence.create("", "loc-1", 1000, 2000)).toThrow();
    });

    it("test_creation_throws_with_departure_before_arrival", () => {
        expect(() => NpcPresence.create("char-1", "loc-1", 2000, 1000)).toThrow();
    });

    it("test_is_present_at_returns_true_within_window", () => {
        const presence = NpcPresence.create("char-1", "loc-1", 1000, 3000);
        expect(presence.isPresentAt(1500)).toBe(true);
        expect(presence.isPresentAt(1000)).toBe(true);
        expect(presence.isPresentAt(2999)).toBe(true);
    });

    it("test_is_present_at_returns_false_outside_window", () => {
        const presence = NpcPresence.create("char-1", "loc-1", 1000, 3000);
        expect(presence.isPresentAt(999)).toBe(false);
        expect(presence.isPresentAt(3000)).toBe(false);
    });

    it("test_is_present_at_returns_true_with_no_scheduled_departure", () => {
        const presence = NpcPresence.create("char-1", "loc-1", 1000, null);
        expect(presence.isPresentAt(999999)).toBe(true);
    });
});
