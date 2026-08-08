import { RegisterModuleCommand } from "../Commands/RegisterModuleCommand";

export class RegisterModuleValidator {

    public validate(
        command: RegisterModuleCommand
    ): void {

        if (!command.module) {

            throw new Error(
                "Module is required."
            );

        }

    }

}