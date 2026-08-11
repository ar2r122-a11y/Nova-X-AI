import { FailStoryCommand } from "../Commands/FailStoryCommand";

export class FailStoryValidator {
    static validate(command: FailStoryCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.reason || command.reason.trim().length === 0) {
            throw new Error("Reason is required.");
        }
    }
}
