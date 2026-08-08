import { ICoreModule } from "../../modules/ICoreModule";

/**
 * Nova X AI
 * Nova Core
 * Application-layer ModuleDependencyValidator
 *
 * Validates that all declared module dependencies are satisfied
 * before a RegisterModuleCommand is dispatched.
 *
 * Uses ICoreModule.moduleName as the stable identity token.
 * Dependency declarations are expressed as moduleName strings
 * via the optional `dependencies` property on the module.
 */
export class ModuleDependencyValidator {

    public validate(
        modules: readonly ICoreModule[]
    ): void {

        const registeredNames = new Set(
            modules.map(m => m.moduleName)
        );

        for (const module of modules) {

            const deps = (module as any).dependencies as string[] | undefined;

            if (!deps || deps.length === 0) {
                continue;
            }

            for (const dep of deps) {

                if (!registeredNames.has(dep)) {

                    throw new Error(
                        `Module '${module.moduleName}' depends on '${dep}', which is not registered.`
                    );

                }

            }

        }

    }

}
