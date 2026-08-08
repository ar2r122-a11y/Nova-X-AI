import { ICoreModule } from "../modules/ICoreModule";

type ModuleWithDependencies = ICoreModule & {
    readonly dependencies?: readonly string[];
};

export class ModuleDependencyValidator {

    public validate(
        modules: readonly ICoreModule[]
    ): void {

        const registeredNames = new Set(
            modules.map(
                module => module.moduleName
            )
        );

        for (const module of modules) {

            const dependencies =
                this.getDependencies(module);

            for (const dependency of dependencies) {

                if (!registeredNames.has(dependency)) {

                    throw new Error(
                        `Module '${module.moduleName}' depends on '${dependency}', which is not registered.`
                    );
                }
            }
        }

        this.sort(modules);
    }

    public sort(
        modules: readonly ICoreModule[]
    ): readonly ICoreModule[] {

        const moduleMap = new Map(
            modules.map(
                module => [
                    module.moduleName,
                    module
                ]
            )
        );

        const result: ICoreModule[] = [];
        const visiting = new Set<string>();
        const visited = new Set<string>();

        const visit = (
            module: ICoreModule
        ): void => {

            if (visited.has(module.moduleName)) {
                return;
            }

            if (visiting.has(module.moduleName)) {

                throw new Error(
                    `Circular module dependency detected at '${module.moduleName}'.`
                );
            }

            visiting.add(module.moduleName);

            for (
                const dependency
                of this.getDependencies(module)
            ) {

                const dependencyModule =
                    moduleMap.get(dependency);

                if (!dependencyModule) {

                    throw new Error(
                        `Module '${module.moduleName}' depends on '${dependency}', which is not registered.`
                    );
                }

                visit(dependencyModule);
            }

            visiting.delete(module.moduleName);
            visited.add(module.moduleName);
            result.push(module);
        };

        for (const module of modules) {
            visit(module);
        }

        return result;
    }

    private getDependencies(
        module: ICoreModule
    ): readonly string[] {

        const moduleWithDependencies =
            module as ModuleWithDependencies;

        return moduleWithDependencies.dependencies ?? [];
    }
}