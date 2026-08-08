import {
    ModuleRegistrationEntity
} from "../Domain/Entities/ModuleRegistrationEntity";

export class HealthyKernelSpecification {

    public isSatisfiedBy(
        modules: readonly ModuleRegistrationEntity[],
        runtimeInitialized: boolean
    ): boolean {

        if (!runtimeInitialized) {
            return false;
        }

        if (modules.length === 0) {
            return false;
        }

        return modules.every(
            module => module.getStatus() !== "failed"
        );

    }

}