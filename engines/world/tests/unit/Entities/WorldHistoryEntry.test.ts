import { describe, it, expect } from "vitest";
import { WorldHistoryEntry } from "../../../src/Domain/Entities/WorldHistoryEntry";
import { WorldEventVersion } from "../../../src/Domain/ValueObjects/WorldEventVersion";

describe("WorldHistoryEntry", () => {
    it("test_creation_succeeds_with_valid_data", () => {
        const entry = WorldHistoryEntry.create(WorldEventVersion.create(1), "TimeAdvanced", 1000, { seconds: 3600 }, "corr-1");
        expect(entry.getVersion().getValue()).toBe(1);
        expect(entry.getEventType()).toBe("TimeAdvanced");
        expect(entry.getTimestamp()).toBe(1000);
        expect(entry.getCorrelationId()).toBe("corr-1");
    });

    it("test_creation_throws_with_empty_event_type", () => {
        expect(() => WorldHistoryEntry.create(WorldEventVersion.create(1), "", 1000, {}, "corr-1")).toThrow();
    });

    it("test_creation_succeeds_with_empty_correlation_id_for_internal_use", () => {
        const entry = WorldHistoryEntry.create(WorldEventVersion.create(1), "type", 1000, {}, "");
        expect(entry.getCorrelationId()).toBe("");
    });
});

