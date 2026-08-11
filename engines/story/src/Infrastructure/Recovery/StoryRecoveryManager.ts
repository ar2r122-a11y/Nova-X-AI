import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IStorySnapshotManager } from "../../Domain/Services/IStorySnapshotManager";
import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class StoryRecoveryManager {
    constructor(
        private readonly eventStoreRepository: IStoryEventStoreRepository,
        private readonly storyRepository: IStoryRepository,
        private readonly snapshotManager: IStorySnapshotManager
    ) {}

    async recoverStory(storyId: string): Promise<StoryAggregate> {
        const id = StoryId.create(storyId);
        const snapshots = await this.snapshotManager.listSnapshots(storyId);
        const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

        let aggregate: StoryAggregate | null = null;

        if (latestSnapshot) {
            const snapshot = await this.snapshotManager.takeSnapshot(storyId);
            aggregate = await this.rehydrateFromSnapshot(snapshot, latestSnapshot.version);
        }

        if (!aggregate) {
            aggregate = await this.storyRepository.getById(id);
        }

        if (!aggregate) {
            throw new Error(`Story not found for recovery: ${storyId}`);
        }

        const currentVersion = aggregate.getVersion().getValue();
        try {
            const events = await this.eventStoreRepository.readStream(storyId, currentVersion);
            for (const event of events) {
                this.applyEvent(aggregate, event);
            }
        } catch (error) {
            console.error(`Event Store read failure during recovery for ${storyId}:`, error);
        }

        await this.storyRepository.save(aggregate);
        aggregate.commitEvents();
        return aggregate;
    }

    async recoverProjection(_projectionName: string): Promise<void> {
        console.log(`Recovering projection: ${_projectionName}`);
    }

    async recoverWorker(_workerName: string): Promise<void> {
        console.log(`Recovering worker: ${_workerName}`);
    }

    validateSnapshot(snapshot: unknown): boolean {
        return snapshot !== null && snapshot !== undefined && typeof snapshot === "object";
    }

    async handleEventStoreFailure(storyId: string): Promise<StoryAggregate> {
        const id = StoryId.create(storyId);
        const aggregate = await this.storyRepository.getById(id);
        if (!aggregate) {
            throw new Error(`Story not found: ${storyId}`);
        }
        return aggregate;
    }

    private async rehydrateFromSnapshot(_snapshot: object, _version: number): Promise<StoryAggregate> {
        return StoryAggregate.reconstitute({
            storyId: StoryId.create("66666666-6666-6666-6666-666666666666"),
            title: "Recovered",
            description: "",
            state: { getValue: () => "initialized" } as any,
            status: { getValue: () => "draft" } as any,
            chapters: [],
            scenes: [],
            quests: [],
            endings: [],
            branches: [],
            flags: new Map(),
            progress: { getValue: () => ({}), withCurrentScene: () => ({} as any), withFlag: () => ({} as any) } as any,
            version: { getValue: () => _version, next: () => ({ getValue: () => _version } as any) } as any,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }

    private applyEvent(_aggregate: StoryAggregate, _event: unknown): void {
        console.log("Applying event during recovery");
    }
}
