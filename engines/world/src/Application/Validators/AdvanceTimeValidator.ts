import { AdvanceTimeCommand } from "../Commands/AdvanceTimeCommand";

export class AdvanceTimeValidator {
    validate(command: AdvanceTimeCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (command.secondsToAdvance <= 0) {
            throw new Error("Seconds to advance must be positive.");
        }
    }
}
