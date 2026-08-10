import { CreateCharacterCommand } from "../Commands";

export class CreateCharacterValidator {
    validate(command: CreateCharacterCommand): void {
        if (!command.name || command.name.trim().length === 0) {
            throw new Error("Character name is required.");
        }
        if (command.name.length > 100) {
            throw new Error("Character name exceeds maximum length of 100 characters.");
        }
        if (command.biography.length > 5000) {
            throw new Error("Biography exceeds maximum length of 5000 characters.");
        }
        if (command.tagline.length > 200) {
            throw new Error("Tagline exceeds maximum length of 200 characters.");
        }
        if (command.occupation.length > 100) {
            throw new Error("Occupation exceeds maximum length of 100 characters.");
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
