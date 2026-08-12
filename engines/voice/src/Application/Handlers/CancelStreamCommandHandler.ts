import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { CancelStreamCommand } from "../Commands/CancelStreamCommand";

export class CancelStreamCommandHandler implements ICommandHandler<CancelStreamCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: CancelStreamCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.cancelStream(command);
    }
}
