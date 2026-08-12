import { InterruptCommand } from "../Commands/InterruptCommand";

export class InterruptCommandValidator {
    validate(command: InterruptCommand): void {
        if (!command.voiceId || command.voiceId.trim().length === 0) {
            throw new Error("VoiceId is required.");
        }
        if (!command.requestId || command.requestId.trim().length === 0) {
            throw new Error("RequestId is required.");
        }
        if (!command.reason || command.reason.trim().length === 0) {
            throw new Error("Reason is required.");
        }
    }
}
