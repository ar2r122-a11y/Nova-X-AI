import { ICommandHandler } from "../Commands/ICommandHandler";
import { InitializeKernelCommand } from "../Commands/InitializeKernelCommand";
import { INovaCoreRuntime } from "../../runtime/INovaCoreRuntime";

export class InitializeKernelHandler
implements ICommandHandler<InitializeKernelCommand> {

    constructor(
        private readonly runtime: INovaCoreRuntime
    ) {}

    public async handle(
        _command: InitializeKernelCommand
    ): Promise<void> {

        await this.runtime.initialize();

    }

}