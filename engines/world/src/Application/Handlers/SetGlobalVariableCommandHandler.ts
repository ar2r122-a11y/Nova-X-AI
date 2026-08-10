import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { SetGlobalVariableCommand } from "../Commands/SetGlobalVariableCommand";
import { SetGlobalVariableValidator } from "../Validators/SetGlobalVariableValidator";

export class SetGlobalVariableCommandHandler implements ICommandHandler<SetGlobalVariableCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: SetGlobalVariableCommand): Promise<void> {
        const validator = new SetGlobalVariableValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.setGlobalVariable(command.worldId, command.key, command.value, command.type);
    }
}
