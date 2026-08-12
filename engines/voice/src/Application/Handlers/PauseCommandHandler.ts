import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { PauseCommand } from "../Commands/PauseCommand";

export class PauseCommandHandler implements ICommandHandler<PauseCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: PauseCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.pause(command);
    }
}
