import { StartStoryCommand } from "../Commands/StartStoryCommand";

export class StartStoryValidator {
    static validate(command: StartStoryCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.title || command.title.trim().length === 0) {
            throw new Error("Title is required.");
        }
    }
}
