import { UpdateCharacterTraitsCommand } from "../Commands";

export class UpdateCharacterTraitsValidator {
    validate(command: UpdateCharacterTraitsCommand): void {
        if (!command.characterId || command.characterId.trim().length === 0) {
            throw new Error("Character ID is required.");
        }
        if (!command.traits || command.traits.length === 0) {
            throw new Error("At least one trait is required.");
        }
        for (const trait of command.traits) {
            if (trait.score < 0.0 || trait.score > 1.0) {
                throw new Error(`Trait score for "${trait.name}" must be between 0.0 and 1.0.`);
            }
        }
    }
}
