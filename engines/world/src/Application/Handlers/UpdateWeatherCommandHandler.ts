import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import { UpdateWeatherCommand } from "../Commands/UpdateWeatherCommand";
import { UpdateWeatherValidator } from "../Validators/UpdateWeatherValidator";

export class UpdateWeatherCommandHandler implements ICommandHandler<UpdateWeatherCommand> {
    constructor(
        private readonly worldEngine: IWorldEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: UpdateWeatherCommand): Promise<void> {
        const validator = new UpdateWeatherValidator();
        validator.validate(command);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        await this.worldEngine.updateWeather(
            command.worldId,
            command.regionId,
            command.conditions
        );
    }
}
