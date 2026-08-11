import { CompleteStoryCommand } from "../Commands/CompleteStoryCommand";

export class CompleteStoryValidator {
    static validate(command: CompleteStoryCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.endingId || command.endingId.trim().length === 0) {
            throw new Error("EndingId is required.");
        }
    }
}
