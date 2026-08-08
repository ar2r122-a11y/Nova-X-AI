import {
    ModuleRegistrationEntity
} from "../Domain/Entities/ModuleRegistrationEntity";

export class ReadyForExecutionSpecification {

    public isSatisfiedBy(
        module: ModuleRegistrationEntity
    ): boolean {

        return module.getStatus() === "registered";

    }

}