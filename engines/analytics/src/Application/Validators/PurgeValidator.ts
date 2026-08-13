import { PurgeCommand } from "../Commands/PurgeCommand";

export class PurgeValidator {
    static validate(command: PurgeCommand): void {
        if (typeof command.olderThanDays !== "number" || command.olderThanDays <= 0) {
            throw new Error("olderThanDays must be a positive number.");
        }
    }
}
