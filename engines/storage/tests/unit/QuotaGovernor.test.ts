import { describe, it, expect } from "vitest";
import { QuotaGovernor } from "../../src/Infrastructure/Persistence/QuotaGovernor.ts";
import { QuotaUsage } from "../../src/Domain/Entities/index.ts";

describe("QuotaGovernor", () => {
    const createQuota = (overrides: Partial<QuotaUsage> = {}): QuotaUsage => ({
        totalBytes: 0,
        eventStoreBytes: 0,
        snapshotBytes: 0,
        backupBytes: 0,
        limitBytes: 1073741824,
        lastUpdated: Date.now(),
        ...overrides
    });

    it("should allow within quota", () => {
        const governor = new QuotaGovernor();
        const result = governor.checkQuota(createQuota({ totalBytes: 100 }));
        expect(result.allowed).toBe(true);
    });

    it("should deny exceeding quota", () => {
        const governor = new QuotaGovernor();
        const result = governor.checkQuota(createQuota({ totalBytes: 1073741824 }));
        expect(result.allowed).toBe(false);
        expect(result.reason).toContain("exceeded");
    });

    it("should calculate usage", () => {
        const governor = new QuotaGovernor();
        const current = createQuota({ totalBytes: 100 });
        const next = governor.calculateUsage(current, { bytes: 50 });
        expect(next.totalBytes).toBe(150);
    });
});
