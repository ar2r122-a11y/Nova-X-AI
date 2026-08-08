import { ICoreModule } from "../Contracts/ICoreModule";

export class ModuleDependencyValidator {

    public validate(modules: readonly ICoreModule[]): void {

        const ids = new Set(
            modules.map(module => module.metadata.id)
        );

        for (const module of modules) {

            for (const dependency of module.metadata.dependencies) {

                if (!ids.has(dependency)) {

                    throw new Error(
                        `Missing dependency '${dependency}' required by '${module.metadata.id}'.`
                    );

                }

            }

        }

    }

}