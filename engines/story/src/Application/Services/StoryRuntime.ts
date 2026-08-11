import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IStoryRuntime } from "./IStoryRuntime";
import { RuntimeState } from "../../Domain/ValueObjects/RuntimeState";
import { StoryRuntimeExecutionContext } from "./StoryRuntimeExecutionContext";

export class StoryRuntime implements IStoryRuntime {
    private readonly activeStories = new Map<string, StoryRuntimeExecutionContext>();
    private state: RuntimeState = RuntimeState.Uninitialized;

    constructor(
        private readonly eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository
    ) {}

    async initialize(): Promise<void> {
        this.state = RuntimeState.Initializing;

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeInitializing",
            timestamp: Date.now(),
            correlationId: `runtime-init-${Date.now()}`,
            payload: {},
        });

        this.state = RuntimeState.Active;

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeActive",
            timestamp: Date.now(),
            correlationId: `runtime-init-${Date.now()}`,
            payload: {},
        });
    }

    async startStory(storyId: string): Promise<void> {
        if (this.state !== RuntimeState.Active) {
            throw new Error(`Cannot start story when runtime is ${this.state}`);
        }

        const context = new StoryRuntimeExecutionContext(storyId, `runtime-${storyId}-${Date.now()}`);
        this.activeStories.set(storyId, context);

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeStoryStarted",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            payload: { storyId },
        });
    }

    async stopStory(storyId: string): Promise<void> {
        const context = this.activeStories.get(storyId);
        if (!context) {
            return;
        }

        context.cancelAll();
        this.activeStories.delete(storyId);

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeStoryStopped",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            payload: { storyId },
        });
    }

    async pauseStory(storyId: string): Promise<void> {
        const context = this.activeStories.get(storyId);
        if (!context) {
            return;
        }

        context.state = RuntimeState.Suspended;

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeStoryPaused",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            payload: { storyId },
        });
    }

    async resumeStory(storyId: string): Promise<void> {
        const context = this.activeStories.get(storyId);
        if (!context) {
            return;
        }

        context.state = RuntimeState.Active;
        context.updateActivity();

        await this.eventBus.publish({
            eventType: "EVT_STORY_RuntimeStoryResumed",
            timestamp: Date.now(),
            correlationId: context.correlationId,
            payload: { storyId },
        });
    }

    async shutdown(): Promise<void> {
        this.state = RuntimeState.Terminated;

        for (const [storyId, context] of this.activeStories) {
            context.cancelAll();

            await this.eventBus.publish({
                eventType: "EVT_STORY_RuntimeStoryStopped",
                timestamp: Date.now(),
                correlationId: context.correlationId,
                payload: { storyId },
            });
        }

        this.activeStories.clear();
    }

    getActiveStories(): string[] {
        return Array.from(this.activeStories.keys());
    }

    getRuntimeState(): RuntimeState {
        return this.state;
    }

    async recover(): Promise<void> {
        this.state = RuntimeState.Initializing;

        const stories = await this.storyRepository.getAll();
        for (const story of stories) {
            const storyId = story.getStoryId().getValue();
            if (!this.activeStories.has(storyId)) {
                await this.startStory(storyId);
            }
        }

        this.state = RuntimeState.Active;
    }
}
