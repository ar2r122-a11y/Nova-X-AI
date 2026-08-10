import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { AdvanceTimeCommand } from "../Commands/AdvanceTimeCommand";
import { AdvanceTimeValidator } from "../Validators/AdvanceTimeValidator";

export class AdvanceTimeCommandHandler implements ICommandHandler<AdvanceTimeCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: AdvanceTimeCommand): Promise<void> {
        const validator = new AdvanceTimeValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.advanceTime(command.worldId, command.secondsToAdvance);
    }
}
