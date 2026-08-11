import { UpdateObjectiveCommand } from "../Commands/UpdateObjectiveCommand";

export class UpdateObjectiveValidator {
    static validate(command: UpdateObjectiveCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.questId || command.questId.trim().length === 0) {
            throw new Error("QuestId is required.");
        }
        if (!command.objectiveId || command.objectiveId.trim().length === 0) {
            throw new Error("ObjectiveId is required.");
        }
        const validActions = ["activate", "complete", "fail", "setProgress"];
        if (!validActions.includes(command.action)) {
            throw new Error(`Invalid objective action: ${command.action}`);
        }
        if (command.action === "setProgress") {
            if (command.progress === undefined || command.progress < 0 || command.progress > 100) {
                throw new Error("Progress must be between 0 and 100 for setProgress action.");
            }
        }
    }
}
