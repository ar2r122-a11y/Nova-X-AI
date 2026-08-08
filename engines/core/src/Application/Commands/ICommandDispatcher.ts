import { ICommand } from "./ICommand";

export interface ICommandDispatcher {

    dispatch<TCommand extends ICommand>(
        command: TCommand
    ): Promise<void>;

}