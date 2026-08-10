import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { InitializeWorldCommand } from "../Commands/InitializeWorldCommand";
import { InitializeWorldValidator } from "../Validators/InitializeWorldValidator";

export class InitializeWorldCommandHandler implements ICommandHandler<InitializeWorldCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: InitializeWorldCommand): Promise<void> {
        const validator = new InitializeWorldValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.initializeWorld(command.worldId, command.name);
    }
}
