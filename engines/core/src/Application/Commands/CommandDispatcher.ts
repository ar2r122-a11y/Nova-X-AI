import { ICommand } from "./ICommand";
import { ICommandDispatcher } from "./ICommandDispatcher";
import { ICommandHandler } from "./ICommandHandler";

export class CommandDispatcher
implements ICommandDispatcher {

    private readonly handlers =
        new Map<
            string,
            ICommandHandler<any>
        >();

    public register<TCommand extends ICommand>(
        commandType: string,
        handler: ICommandHandler<TCommand>
    ): void {

        this.handlers.set(
            commandType,
            handler
        );

    }

    public async dispatch<TCommand extends ICommand>(
        command: TCommand
    ): Promise<void> {

        const handler =
            this.handlers.get(
                command.constructor.name
            );

        if (!handler) {

            throw new Error(
                `Command handler '${command.constructor.name}' is not registered.`
            );

        }

        try {

            await handler.handle(
                command
            );

        }
        catch (error) {

            throw error;

        }

    }

}