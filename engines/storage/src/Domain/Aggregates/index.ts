import { StorageEvent, StorageSnapshot, QuotaUsage } from "../Entities";

export class StorageEngineAggregate {
    private readonly events: StorageEvent[] = [];
    private readonly snapshots: Map<string, StorageSnapshot> = new Map();
    private quota: QuotaUsage;
    private state: "initialized" | "running" | "stopped" | "failed" = "initialized";

    constructor(initialQuota: QuotaUsage) {
        this.quota = initialQuota;
    }

    public applyEvent(event: StorageEvent): void {
        this.events.push(event);
    }

    public takeSnapshot(streamId: string, data: unknown, version: number, checksum: string): StorageSnapshot {
        const snapshot: StorageSnapshot = {
            snapshotId: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            streamId,
            version,
            data,
            checksum,
            createdAt: Date.now(),
            compressed: false
        };
        this.snapshots.set(streamId, snapshot);
        return snapshot;
    }

    public restoreSnapshot(streamId: string): StorageSnapshot | undefined {
        return this.snapshots.get(streamId);
    }

    public updateQuota(usage: Partial<QuotaUsage>): void {
        this.quota = { ...this.quota, ...usage, lastUpdated: Date.now() };
    }

    public getQuota(): QuotaUsage {
        return this.quota;
    }

    public setState(state: "initialized" | "running" | "stopped" | "failed"): void {
        this.state = state;
    }

    public getState(): string {
        return this.state;
    }

    public getUncommittedEvents(): StorageEvent[] {
        return this.events;
    }
}
