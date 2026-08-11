import { Quest } from "../Entities/Quest";
import { QuestStatus } from "../ValueObjects/QuestStatus";
import { StoryStatus } from "../ValueObjects/StoryStatus";

export class QuestProgressionPolicy {
    static canActivateQuest(questStatus: QuestStatus, storyStatus: StoryStatus): boolean {
        const questOk = questStatus === "not_started";
        const storyOk = storyStatus === "active" || storyStatus === "paused";
        return questOk && storyOk;
    }

    static canCompleteQuest(quest: Quest): boolean {
        return quest.canComplete();
    }

    static calculateQuestProgress(quest: Quest): number {
        return quest.getProgress();
    }
}
