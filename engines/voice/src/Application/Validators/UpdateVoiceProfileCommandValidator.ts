import { UpdateVoiceProfileCommand } from "../Commands/UpdateVoiceProfileCommand";

export class UpdateVoiceProfileCommandValidator {
    validate(command: UpdateVoiceProfileCommand): void {
        if (!command.profileId || command.profileId.trim().length === 0) {
            throw new Error("ProfileId is required.");
        }
        if (command.speakingRate !== undefined && (command.speakingRate < 0.5 || command.speakingRate > 2.0)) {
            throw new Error("SpeakingRate must be between 0.5 and 2.0.");
        }
        if (command.pitchModifier !== undefined && (command.pitchModifier < -1.0 || command.pitchModifier > 1.0)) {
            throw new Error("PitchModifier must be between -1.0 and 1.0.");
        }
    }
}
