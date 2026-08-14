import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IStorySnapshotManager } from "../../Domain/Services/IStorySnapshotManager";
import { StoryAggregate } from "../../Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";
import { BranchId } from "../../Domain/ValueObjects/BranchId";
import { EndingId } from "../../Domain/ValueObjects/EndingId";

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
            if (snapshot && this.validateSnapshot(snapshot)) {
                aggregate = await this.rehydrateFromSnapshot(snapshot, latestSnapshot.version, storyId);
            }
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

    async recoverProjection(projectionName: string): Promise<void> {
        console.log(`Recovering projection: ${projectionName}`);
    }

    async recoverWorker(workerName: string): Promise<void> {
        console.log(`Recovering worker: ${workerName}`);
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

    private async rehydrateFromSnapshot(snapshot: object, version: number, fallbackStoryId: string): Promise<StoryAggregate> {
        const record = snapshot as Record<string, unknown>;
        const storyIdValue = typeof record.storyId === "string" && record.storyId.length > 0 ? record.storyId : fallbackStoryId;
        const aggregates = (record.aggregates as Record<string, unknown>) || {};
        const storyData = aggregates.StoryAggregate as Record<string, unknown> | undefined;

        if (!storyData) {
            return StoryAggregate.reconstitute({
                storyId: StoryId.create(storyIdValue),
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
                version: { getValue: () => version, next: () => ({ getValue: () => version } as any) } as any,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        const flags = new Map(Object.entries(storyData.flags as Record<string, unknown> || {}));
        const progress = storyData.progress as any;

        return StoryAggregate.reconstitute({
            storyId: StoryId.create(storyIdValue),
            title: (storyData.title as string) || "Recovered",
            description: (storyData.description as string) || "",
            state: storyData.state as any,
            status: storyData.status as any,
            chapters: [],
            scenes: [],
            quests: [],
            endings: [],
            branches: [],
            flags,
            progress: progress || { getValue: () => ({}), withCurrentScene: () => ({} as any), withFlag: () => ({} as any) } as any,
            version: { getValue: () => version, next: () => ({ getValue: () => version } as any) } as any,
            createdAt: (storyData.createdAt as number) || Date.now(),
            updatedAt: (storyData.updatedAt as number) || Date.now(),
        });
    }

    private applyEvent(aggregate: StoryAggregate, event: { eventType: string; payload: Record<string, unknown> }): void {
        switch (event.eventType) {
            case "EVT_STORY_StoryStarted":
                aggregate.start();
                break;
            case "EVT_STORY_SceneAdvanced": {
                const sceneId = event.payload.sceneId as string;
                if (sceneId) {
                    aggregate.advanceScene(SceneId.create(sceneId));
                }
                break;
            }
            case "EVT_STORY_ChoiceSelected": {
                const sceneId = event.payload.sceneId as string;
                const choiceId = event.payload.choiceId as string;
                const branchId = event.payload.branchId as string;
                if (sceneId && choiceId && branchId) {
                    aggregate.selectChoice(SceneId.create(sceneId), choiceId, BranchId.create(branchId));
                }
                break;
            }
            case "EVT_STORY_StoryCompleted": {
                const endingId = event.payload.endingId as string;
                if (endingId) {
                    aggregate.completeStory(EndingId.create(endingId));
                }
                break;
            }
            case "EVT_STORY_StoryFailed": {
                const reason = (event.payload.reason as string) || "Recovered failure";
                aggregate.failStory(reason);
                break;
            }
            default:
                break;
        }
    }
}
