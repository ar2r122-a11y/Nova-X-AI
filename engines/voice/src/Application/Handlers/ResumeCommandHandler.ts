import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { ResumeCommand } from "../Commands/ResumeCommand";

export class ResumeCommandHandler implements ICommandHandler<ResumeCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: ResumeCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.resume(command);
    }
}
