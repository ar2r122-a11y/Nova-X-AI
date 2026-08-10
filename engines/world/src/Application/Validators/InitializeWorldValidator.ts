import { InitializeWorldCommand } from "../Commands/InitializeWorldCommand";

export class InitializeWorldValidator {
    validate(command: InitializeWorldCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (!command.name || command.name.trim().length === 0) {
            throw new Error("World name is required.");
        }
        if (command.name.length > 100) {
            throw new Error("World name exceeds maximum length of 100 characters.");
        }
    }
}
