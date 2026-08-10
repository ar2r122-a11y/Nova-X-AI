import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { TransitionRegionCommand } from "../Commands/TransitionRegionCommand";
import { TransitionRegionValidator } from "../Validators/TransitionRegionValidator";

export class TransitionRegionCommandHandler implements ICommandHandler<TransitionRegionCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: TransitionRegionCommand): Promise<void> {
        const validator = new TransitionRegionValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.transitionWorldState(command.worldId, command.targetState);
    }
}
