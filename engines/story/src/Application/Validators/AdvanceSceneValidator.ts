import { AdvanceSceneCommand } from "../Commands/AdvanceSceneCommand";

export class AdvanceSceneValidator {
    static validate(command: AdvanceSceneCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.sceneId || command.sceneId.trim().length === 0) {
            throw new Error("SceneId is required.");
        }
    }
}
