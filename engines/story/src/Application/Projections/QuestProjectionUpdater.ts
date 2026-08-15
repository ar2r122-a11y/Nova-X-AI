import { QuestUpdatedEvent } from "../../Domain/Events/QuestUpdatedEvent";
import { StoryReadModelImpl } from "./StoryReadModelImpl";
import { QuestDto } from "../DTO/QuestDto";

export class QuestProjectionUpdater {
    constructor(private readonly readModel: StoryReadModelImpl) {}

    async handle(event: QuestUpdatedEvent): Promise<void> {
        const existing = await this.readModel.getStory(event.storyId);
        if (!existing) {
            return;
        }

        const questIndex = existing.quests.findIndex((q) => q.questId === event.questId);
        if (questIndex >= 0) {
            existing.quests[questIndex] = {
                ...existing.quests[questIndex],
                status: event.status,
                progress: event.progress,
            };
        } else {
            const newQuest: QuestDto = {
                questId: event.questId,
                storyId: event.storyId,
                title: "",
                description: "",
                type: "main",
                status: event.status,
                objectives: [],
                rewards: {},
                prerequisites: [],
                narrativeFlags: {},
                progress: event.progress,
                createdAt: event.timestamp,
                updatedAt: event.timestamp,
            };
            existing.quests.push(newQuest);
        }
        existing.updatedAt = event.timestamp;
        await this.readModel.saveStory(existing);
    }
}
