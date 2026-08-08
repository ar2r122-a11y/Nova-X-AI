import { ICommandHandler } from "../Commands/ICommandHandler";
import { RegisterModuleCommand } from "../Commands/RegisterModuleCommand";
import { INovaCoreRuntime } from "../../runtime/INovaCoreRuntime";

export class RegisterModuleHandler
implements ICommandHandler<RegisterModuleCommand> {

    constructor(
        private readonly runtime: INovaCoreRuntime
    ) {}

    public async handle(
        command: RegisterModuleCommand
    ): Promise<void> {

        this.runtime.registerModule(
            command.module
        );

    }

}