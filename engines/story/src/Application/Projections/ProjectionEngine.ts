import type { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";
import { IProjectionStore } from "@nova-x-ai/storage";
import { StoryProjectionUpdater } from "./StoryProjectionUpdater";
import { QuestProjectionUpdater } from "./QuestProjectionUpdater";
import { StoryReadModelImpl } from "./StoryReadModelImpl";

export class ProjectionEngine {
    private readonly handlers = new Map<string, IEventHandler<IDomainEvent>[]>();
    private running = false;

    constructor(
        private readonly eventBus: IEventBus,
        private readonly projectionStore: IProjectionStore
    ) {
        const readModel = new StoryReadModelImpl(projectionStore);
        this.storyProjectionUpdater = new StoryProjectionUpdater(readModel);
        this.questProjectionUpdater = new QuestProjectionUpdater(readModel);
    }

    private readonly storyProjectionUpdater: StoryProjectionUpdater;
    private readonly questProjectionUpdater: QuestProjectionUpdater;

    start(): void {
        if (this.running) {
            return;
        }
        this.running = true;

        this.registerHandler("EVT_STORY_StoryStarted", this.storyProjectionUpdater);
        this.registerHandler("EVT_STORY_SceneAdvanced", this.storyProjectionUpdater);
        this.registerHandler("EVT_STORY_ChoiceSelected", this.storyProjectionUpdater);
        this.registerHandler("EVT_STORY_QuestUpdated", this.questProjectionUpdater);
        this.registerHandler("EVT_STORY_StoryCompleted", this.storyProjectionUpdater);
        this.registerHandler("EVT_STORY_StoryFailed", this.storyProjectionUpdater);

        for (const [eventType, handlers] of this.handlers.entries()) {
            for (const handler of handlers) {
                this.eventBus.subscribe(eventType, handler);
            }
        }
    }

    stop(): void {
        this.running = false;
    }

    registerHandler<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void {
        const existing = this.handlers.get(eventType) || [];
        existing.push(handler as IEventHandler<IDomainEvent>);
        this.handlers.set(eventType, existing);
    }

    async rebuild(): Promise<void> {
        await this.projectionStore.resetProjection("story_read_model");
    }
}
