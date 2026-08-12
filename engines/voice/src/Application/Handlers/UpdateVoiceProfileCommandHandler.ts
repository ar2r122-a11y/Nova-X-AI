import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { UpdateVoiceProfileCommand } from "../Commands/UpdateVoiceProfileCommand";
import { UpdateVoiceProfileCommandValidator } from "../Validators/UpdateVoiceProfileCommandValidator";

export class UpdateVoiceProfileCommandHandler implements ICommandHandler<UpdateVoiceProfileCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: UpdateVoiceProfileCommand): Promise<void> {
        const validator = new UpdateVoiceProfileCommandValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.updateVoiceProfile(command);
    }
}
