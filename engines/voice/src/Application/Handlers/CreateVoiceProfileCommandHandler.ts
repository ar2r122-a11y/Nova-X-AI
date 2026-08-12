import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { CreateVoiceProfileCommand } from "../Commands/CreateVoiceProfileCommand";
import { CreateVoiceProfileCommandValidator } from "../Validators/CreateVoiceProfileCommandValidator";

export class CreateVoiceProfileCommandHandler implements ICommandHandler<CreateVoiceProfileCommand> {
    constructor(
        private readonly voiceEngine: IVoiceEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: CreateVoiceProfileCommand): Promise<void> {
        const validator = new CreateVoiceProfileCommandValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.createVoiceProfile(command);
    }
}
