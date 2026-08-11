import type { IEventBus } from "@nova-x-ai/core";

export class StoryMetrics {
    private sceneTransitionDurations: number[] = [];
    private eventStoreAppendCount = 0;
    private projectionLagMs = 0;
    private storyProgressionStats: Record<string, number> = {};
    private workerHealth: Record<string, string> = {};

    constructor(private readonly eventBus: IEventBus) {}

    recordSceneTransition(durationMs: number): void {
        this.sceneTransitionDurations.push(durationMs);
        this.eventBus.publish({
            eventType: "EVT_STORY_MetricRecorded",
            timestamp: Date.now(),
            correlationId: "",
            payload: {
                metric: "sceneTransitionDuration",
                value: durationMs,
            },
        });
    }

    recordEventStoreAppend(): void {
        this.eventStoreAppendCount++;
        this.eventBus.publish({
            eventType: "EVT_STORY_MetricRecorded",
            timestamp: Date.now(),
            correlationId: "",
            payload: {
                metric: "eventStoreAppendCount",
                value: this.eventStoreAppendCount,
            },
        });
    }

    recordProjectionLag(lagMs: number): void {
        this.projectionLagMs = lagMs;
        this.eventBus.publish({
            eventType: "EVT_STORY_MetricRecorded",
            timestamp: Date.now(),
            correlationId: "",
            payload: {
                metric: "projectionLag",
                value: lagMs,
            },
        });
    }

    recordWorkerHealth(workerName: string, state: string): void {
        this.workerHealth[workerName] = state;
        this.eventBus.publish({
            eventType: "EVT_STORY_MetricRecorded",
            timestamp: Date.now(),
            correlationId: "",
            payload: {
                metric: "workerHealth",
                workerName,
                value: state,
            },
        });
    }

    recordStoryProgression(storyId: string, progress: number): void {
        this.storyProgressionStats[storyId] = progress;
        this.eventBus.publish({
            eventType: "EVT_STORY_MetricRecorded",
            timestamp: Date.now(),
            correlationId: "",
            payload: {
                metric: "storyProgression",
                storyId,
                value: progress,
            },
        });
    }

    getMetrics(): {
        sceneTransitionDurations: number[];
        eventStoreAppendCount: number;
        projectionLagMs: number;
        storyProgressionStats: Record<string, number>;
        workerHealth: Record<string, string>;
    } {
        return {
            sceneTransitionDurations: [...this.sceneTransitionDurations],
            eventStoreAppendCount: this.eventStoreAppendCount,
            projectionLagMs: this.projectionLagMs,
            storyProgressionStats: { ...this.storyProgressionStats },
            workerHealth: { ...this.workerHealth },
        };
    }
}
