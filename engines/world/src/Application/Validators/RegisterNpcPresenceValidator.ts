import { RegisterNpcPresenceCommand } from "../Commands/RegisterNpcPresenceCommand";

export class RegisterNpcPresenceValidator {
    validate(command: RegisterNpcPresenceCommand): void {
        if (!command.worldId || command.worldId.trim().length === 0) {
            throw new Error("WorldId is required.");
        }
        if (!command.characterId || command.characterId.trim().length === 0) {
            throw new Error("CharacterId is required.");
        }
        if (!command.locationId || command.locationId.trim().length === 0) {
            throw new Error("LocationId is required.");
        }
        if (command.action !== "arrived" && command.action !== "departed") {
            throw new Error("Action must be 'arrived' or 'departed'.");
        }
    }
}
