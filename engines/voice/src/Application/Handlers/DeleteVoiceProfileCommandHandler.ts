import { ICommandHandler } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import { DeleteVoiceProfileCommand } from "../Commands/DeleteVoiceProfileCommand";

export class DeleteVoiceProfileCommandHandler implements ICommandHandler<DeleteVoiceProfileCommand> {
    constructor(private readonly voiceEngine: IVoiceEngine) {}

    async handle(command: DeleteVoiceProfileCommand): Promise<void> {
        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.voiceEngine.deleteVoiceProfile(command);
    }
}
