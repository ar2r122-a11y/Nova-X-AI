import { ICommandHandler } from "../Commands/ICommandHandler";
import { ShutdownKernelCommand } from "../Commands/ShutdownKernelCommand";
import { INovaCoreRuntime } from "../../runtime/INovaCoreRuntime";

export class ShutdownKernelHandler
implements ICommandHandler<ShutdownKernelCommand> {

    constructor(
        private readonly runtime: INovaCoreRuntime
    ) {}

    public async handle(
        command: ShutdownKernelCommand
    ): Promise<void> {

        await this.runtime.shutdown();

    }

}