import { ICommand } from "./ICommand";
import { ICoreModule } from "../../modules/ICoreModule";

export class RegisterModuleCommand
implements ICommand {

    constructor(
        public readonly module: ICoreModule
    ) {}

}