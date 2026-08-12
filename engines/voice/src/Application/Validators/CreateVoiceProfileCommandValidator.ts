import { CreateVoiceProfileCommand } from "../Commands/CreateVoiceProfileCommand";

export class CreateVoiceProfileCommandValidator {
    validate(command: CreateVoiceProfileCommand): void {
        if (!command.characterId || command.characterId.trim().length === 0) {
            throw new Error("CharacterId is required.");
        }
        if (!command.voiceId || command.voiceId.trim().length === 0) {
            throw new Error("VoiceId is required.");
        }
        if (!command.locale || command.locale.trim().length === 0) {
            throw new Error("Locale is required.");
        }
    }
}
