import { UpdateQuestCommand } from "../Commands/UpdateQuestCommand";

export class UpdateQuestValidator {
    static validate(command: UpdateQuestCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.questId || command.questId.trim().length === 0) {
            throw new Error("QuestId is required.");
        }
        const validActions = ["activate", "complete", "fail"];
        if (!validActions.includes(command.action)) {
            throw new Error(`Invalid quest action: ${command.action}`);
        }
    }
}
