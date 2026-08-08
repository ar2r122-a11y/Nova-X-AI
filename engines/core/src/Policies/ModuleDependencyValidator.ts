import { ICoreModule } from "../modules/ICoreModule";

export class ModuleDependencyValidator {

    public validate(
        modules: readonly ICoreModule[]
    ): void {

        const registeredModules = new Set(
            modules.map(module => module.metadata.id)
        );

        for (const module of modules) {

            for (const dependency of module.metadata.dependencies) {

                if (!registeredModules.has(dependency)) {

                    throw new Error(
                        `Module '${module.metadata.id}' depends on '${dependency}', but it is not registered.`
                    );

                }

            }

        }

    }

}