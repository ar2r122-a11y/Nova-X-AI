import { SetGlobalVariableCommand } from "../Commands/SetGlobalVariableCommand";

export class SetGlobalVariableValidator {
    validate(command: SetGlobalVariableCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (!command.key || command.key.trim().length === 0) {
            throw new Error("Key is required.");
        }
        if (command.value === null || command.value === undefined) {
            throw new Error("Value cannot be null or undefined.");
        }
    }
}
