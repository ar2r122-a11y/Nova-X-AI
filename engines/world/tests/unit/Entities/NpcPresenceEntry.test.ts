import { describe, it, expect } from "vitest";
import { NpcPresenceEntry } from "../../../src/Domain/Entities/NpcPresenceEntry";
import { LocationId } from "../../../src/Domain/ValueObjects/LocationId";

describe("NpcPresenceEntry", () => {
    it("test_creation_succeeds_with_valid_data", () => {
        const entry = NpcPresenceEntry.create("char-1", LocationId.create("loc-1"), 1000, 2000);
        expect(entry.getCharacterId()).toBe("char-1");
        expect(entry.getLocationId().getValue()).toBe("loc-1");
        expect(entry.getArrivedAt()).toBe(1000);
        expect(entry.getScheduledDeparture()).toBe(2000);
    });

    it("test_is_present_at_returns_true_within_window", () => {
        const entry = NpcPresenceEntry.create("char-1", LocationId.create("loc-1"), 1000, 3000);
        expect(entry.isPresentAt(1500)).toBe(true);
        expect(entry.isPresentAt(1000)).toBe(true);
        expect(entry.isPresentAt(2999)).toBe(true);
        expect(entry.isPresentAt(999)).toBe(false);
        expect(entry.isPresentAt(3000)).toBe(false);
    });

    it("test_is_present_at_returns_true_with_no_scheduled_departure", () => {
        const entry = NpcPresenceEntry.create("char-1", LocationId.create("loc-1"), 1000, null);
        expect(entry.isPresentAt(999999)).toBe(true);
    });
});

