import { ICommand } from "./ICommand";

export interface ICommandHandler<
    TCommand extends ICommand
> {

    handle(
        command: TCommand
    ): Promise<void>;

}