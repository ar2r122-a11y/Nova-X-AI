import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { RegenerateAudioCommand } from "../Commands/RegenerateAudioCommand";

export class RegenerateAudioCommandHandler implements ICommandHandler<RegenerateAudioCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: RegenerateAudioCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.regenerateAudio(command);
    }
}
