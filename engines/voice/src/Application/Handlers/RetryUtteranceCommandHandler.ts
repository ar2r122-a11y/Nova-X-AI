import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { RetryUtteranceCommand } from "../Commands/RetryUtteranceCommand";

export class RetryUtteranceCommandHandler implements ICommandHandler<RetryUtteranceCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: RetryUtteranceCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.retryUtterance(command);
    }
}
