import { SetOptOutCommand } from "../Commands/SetOptOutCommand";

export class SetOptOutValidator {
    static validate(command: SetOptOutCommand): void {
        if (typeof command.optedOut !== "boolean") {
            throw new Error("optedOut must be a boolean.");
        }
    }
}
