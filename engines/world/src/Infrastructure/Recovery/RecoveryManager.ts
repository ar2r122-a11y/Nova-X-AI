import { IEventStore, ISnapshotStore, StorageSnapshot, IProjectionStore } from "@nova-x-ai/storage";
import { CircuitBreaker, CircuitBreakerState } from "./CircuitBreaker";
import { EventAppendRetryQueue } from "./EventAppendRetryQueue";

export class RecoveryManager {
    private readonly retryQueue: EventAppendRetryQueue;

    constructor(
        private readonly eventStore: IEventStore,
        private readonly snapshotStore: ISnapshotStore,
        private readonly projectionStore: IProjectionStore
    ) {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 5,
            recoveryTimeoutMs: 30000,
            halfOpenMaxCalls: 3
        });
        this.retryQueue = new EventAppendRetryQueue();
    }

    async recoverStorage(): Promise<void> {
        const circuitBreaker = new CircuitBreaker({
            failureThreshold: 5,
            recoveryTimeoutMs: 30000,
            halfOpenMaxCalls: 3
        });

        await circuitBreaker.execute(async () => {
            const snapshots = await this.snapshotStore.getAllSnapshots();
            for (const snapshot of snapshots) {
                if (!this.isValidSnapshot(snapshot)) {
                    await this.snapshotStore.deleteSnapshot(snapshot.snapshotId);
                }
            }
        });
    }

    async rebuildProjection(worldId: string): Promise<void> {
        const names = await this.projectionStore.listProjections();
        for (const name of names) {
            if (name.includes(worldId)) {
                await this.projectionStore.resetProjection(name);
            }
        }
    }

    async rebuildSpatialIndex(worldId: string): Promise<void> {
        const events = await this.eventStore.readAllStreams(0, 10000);
        for (const event of events) {
            if (event.streamId.includes(worldId) && event.eventType === "EVT_WORLD_NpcPresenceUpdated") {
                const payload = event.data as Record<string, unknown>;
                if (payload.locationId && payload.characterId) {
                }
            }
        }
    }

    async replayEvents(worldId: string, fromVersion: number): Promise<void> {
        const events = await this.eventStore.readStream(worldId, fromVersion);
        for (const event of events) {
            this.retryQueue.enqueue(event);
        }
        await this.retryQueue.process(async (e: unknown) => {
            const storageEvent = e as { eventType: string };
        });
    }

    private isValidSnapshot(snapshot: StorageSnapshot): boolean {
        return snapshot.snapshotId.length > 0 && snapshot.streamId.length > 0;
    }
}
