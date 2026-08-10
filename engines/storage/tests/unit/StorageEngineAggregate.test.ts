import { describe, it, expect } from "vitest";
import { StorageEngineAggregate } from "../../src/Domain/Aggregates/index.ts";
import { QuotaUsage } from "../../src/Domain/Entities/index.ts";

describe("StorageEngineAggregate", () => {
    const createQuota = (): QuotaUsage => ({
        totalBytes: 0,
        eventStoreBytes: 0,
        snapshotBytes: 0,
        backupBytes: 0,
        limitBytes: 1073741824,
        lastUpdated: Date.now()
    });

    it("should initialize with quota", () => {
        const aggregate = new StorageEngineAggregate(createQuota());
        expect(aggregate.getQuota().limitBytes).toBe(1073741824);
    });

    it("should apply events", () => {
        const aggregate = new StorageEngineAggregate(createQuota());
        aggregate.applyEvent({
            eventId: "1",
            streamId: "s1",
            eventType: "test",
            data: {},
            version: 1,
            timestamp: Date.now(),
            correlationId: "c1",
            checksum: "sha256-abc"
        });
        expect(aggregate.getUncommittedEvents()).toHaveLength(1);
    });

    it("should take and restore snapshot", () => {
        const aggregate = new StorageEngineAggregate(createQuota());
        const snapshot = aggregate.takeSnapshot("s1", { a: 1 }, 1, "sha256-abc");
        expect(snapshot.streamId).toBe("s1");
        const restored = aggregate.restoreSnapshot("s1");
        expect(restored).toBeDefined();
        expect(restored!.version).toBe(1);
    });

    it("should update quota", () => {
        const aggregate = new StorageEngineAggregate(createQuota());
        aggregate.updateQuota({ totalBytes: 500 });
        expect(aggregate.getQuota().totalBytes).toBe(500);
    });
});
