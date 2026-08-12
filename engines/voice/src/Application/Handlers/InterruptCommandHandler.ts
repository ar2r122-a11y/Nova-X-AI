import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { InterruptCommand } from "../Commands/InterruptCommand";
import { InterruptCommandValidator } from "../Validators/InterruptCommandValidator";

export class InterruptCommandHandler implements ICommandHandler<InterruptCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: InterruptCommand): Promise<void> {
        const validator = new InterruptCommandValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.interrupt(command);
    }
}
