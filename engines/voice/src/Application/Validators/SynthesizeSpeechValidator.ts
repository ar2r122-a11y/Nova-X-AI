import { SynthesizeSpeechCommand } from "../Commands/SynthesizeSpeechCommand";

export class SynthesizeSpeechValidator {
    validate(command: SynthesizeSpeechCommand): void {
        if (!command.voiceId || command.voiceId.trim().length === 0) {
            throw new Error("VoiceId is required.");
        }
        if (!command.text || command.text.trim().length === 0) {
            throw new Error("Text is required.");
        }
        if (command.text.length > 2048) {
            throw new Error("Text exceeds maximum length of 2048 characters.");
        }
        if (!command.voiceProfileId || command.voiceProfileId.trim().length === 0) {
            throw new Error("VoiceProfileId is required.");
        }
    }
}
