import { StoryStartedEvent, SceneAdvancedEvent, ChoiceSelectedEvent, StoryCompletedEvent, StoryFailedEvent } from "../../Domain/Events";
import { StoryReadModelImpl } from "./StoryReadModelImpl";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";

export class StoryProjectionUpdater {
    constructor(private readonly readModel: StoryReadModelImpl) {}

    async handle(event: StoryStartedEvent | SceneAdvancedEvent | ChoiceSelectedEvent | StoryCompletedEvent | StoryFailedEvent): Promise<void> {
        const eventType = (event as any).eventType;

        if (eventType === "EVT_STORY_StoryStarted") {
            await this.handleStoryStarted(event as StoryStartedEvent);
        } else if (eventType === "EVT_STORY_SceneAdvanced") {
            await this.handleSceneAdvanced(event as SceneAdvancedEvent);
        } else if (eventType === "EVT_STORY_ChoiceSelected") {
            await this.handleChoiceSelected(event as ChoiceSelectedEvent);
        } else if (eventType === "EVT_STORY_StoryCompleted") {
            await this.handleStoryCompleted(event as StoryCompletedEvent);
        } else if (eventType === "EVT_STORY_StoryFailed") {
            await this.handleStoryFailed(event as StoryFailedEvent);
        }
    }

    private async handleStoryStarted(event: StoryStartedEvent): Promise<void> {
        const dto: StoryAggregateDto = {
            storyId: event.storyId,
            title: event.title,
            description: "",
            state: "initialized",
            status: "active",
            version: 0,
            progress: {
                currentChapterId: null,
                currentSceneId: null,
                completedScenes: [],
                activeQuests: [],
                completedQuests: [],
                narrativeFlags: {},
            },
            chapters: [],
            scenes: [],
            quests: [],
            endings: [],
            branches: [],
            flags: {},
            createdAt: event.timestamp,
            updatedAt: event.timestamp,
        };
        await this.readModel.saveStory(dto);
    }

    private async handleSceneAdvanced(event: SceneAdvancedEvent): Promise<void> {
        const existing = await this.readModel.getStory(event.storyId);
        if (!existing) {
            return;
        }
        existing.progress.currentSceneId = event.sceneId;
        if (event.previousSceneId) {
            existing.progress.completedScenes = [
                ...existing.progress.completedScenes.filter((id) => id !== event.previousSceneId),
                event.previousSceneId,
            ];
        }
        existing.updatedAt = event.timestamp;
        await this.readModel.saveStory(existing);
    }

    private async handleChoiceSelected(event: ChoiceSelectedEvent): Promise<void> {
        const existing = await this.readModel.getStory(event.storyId);
        if (!existing) {
            return;
        }
        existing.flags = { ...existing.flags, ...event.selectedFlags };
        existing.updatedAt = event.timestamp;
        await this.readModel.saveStory(existing);
    }

    private async handleStoryCompleted(event: StoryCompletedEvent): Promise<void> {
        const existing = await this.readModel.getStory(event.storyId);
        if (!existing) {
            return;
        }
        existing.state = "completed";
        existing.status = "completed";
        existing.flags = { ...existing.flags, ...event.finalFlags };
        existing.updatedAt = event.timestamp;
        await this.readModel.saveStory(existing);
    }

    private async handleStoryFailed(event: StoryFailedEvent): Promise<void> {
        const existing = await this.readModel.getStory(event.storyId);
        if (!existing) {
            return;
        }
        existing.state = "failed";
        existing.status = "failed";
        existing.updatedAt = event.timestamp;
        await this.readModel.saveStory(existing);
    }
}
