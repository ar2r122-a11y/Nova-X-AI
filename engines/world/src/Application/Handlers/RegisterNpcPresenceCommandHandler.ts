import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { RegisterNpcPresenceCommand } from "../Commands/RegisterNpcPresenceCommand";
import { RegisterNpcPresenceValidator } from "../Validators/RegisterNpcPresenceValidator";

export class RegisterNpcPresenceCommandHandler implements ICommandHandler<RegisterNpcPresenceCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: RegisterNpcPresenceCommand): Promise<void> {
        const validator = new RegisterNpcPresenceValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.updateNpcPresence(
            command.worldId,
            command.characterId,
            command.locationId,
            command.action
        );
    }
}
