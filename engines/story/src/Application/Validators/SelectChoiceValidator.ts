import { SelectChoiceCommand } from "../Commands/SelectChoiceCommand";

export class SelectChoiceValidator {
    static validate(command: SelectChoiceCommand): void {
        if (!command.storyId || command.storyId.trim().length === 0) {
            throw new Error("StoryId is required.");
        }
        if (!command.sceneId || command.sceneId.trim().length === 0) {
            throw new Error("SceneId is required.");
        }
        if (!command.choiceId || command.choiceId.trim().length === 0) {
            throw new Error("ChoiceId is required.");
        }
        if (!command.branchId || command.branchId.trim().length === 0) {
            throw new Error("BranchId is required.");
        }
    }
}
