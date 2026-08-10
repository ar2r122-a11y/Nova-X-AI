import type { IQuotaPolicy, QuotaUsage } from "../../Contracts";

export class QuotaGovernor implements IQuotaPolicy {
    private readonly nearLimitThreshold = 0.85;

    checkQuota(usage: QuotaUsage): { allowed: boolean; reason?: string } {
        if (usage.totalBytes >= usage.limitBytes) {
            return { allowed: false, reason: `Storage quota exceeded: ${usage.totalBytes}/${usage.limitBytes}` };
        }
        if (usage.totalBytes >= usage.limitBytes * this.nearLimitThreshold) {
            return { allowed: true, reason: "Near quota limit" };
        }
        return { allowed: true };
    }

    calculateUsage(current: QuotaUsage, addition: { bytes: number }): QuotaUsage {
        return {
            totalBytes: current.totalBytes + addition.bytes,
            eventStoreBytes: current.eventStoreBytes + addition.bytes,
            snapshotBytes: current.snapshotBytes,
            backupBytes: current.backupBytes,
            limitBytes: current.limitBytes,
            lastUpdated: Date.now()
        };
    }

    async getEvictionCandidates(_usage: QuotaUsage): Promise<string[]> {
        const snapshots: string[] = [];
        return snapshots;
    }
}
