import { ICoreModule } from "../modules/ICoreModule";

/**
 * Nova X AI
 * Nova Core
 * ModuleFactory
 *
 * Creates and retrieves registered ICoreModule instances by moduleName.
 */
export class ModuleFactory {

    private readonly registry = new Map<string, ICoreModule>();

    public register(
        module: ICoreModule
    ): void {

        if (this.registry.has(module.moduleName)) {

            throw new Error(
                `Module '${module.moduleName}' is already registered in the factory.`
            );

        }

        this.registry.set(
            module.moduleName,
            module
        );

    }

    public create(
        moduleName: string
    ): ICoreModule {

        const module = this.registry.get(moduleName);

        if (!module) {

            throw new Error(
                `Module '${moduleName}' is not registered in the factory.`
            );

        }

        return module;

    }

    public has(
        moduleName: string
    ): boolean {

        return this.registry.has(moduleName);

    }

    public getAll(): readonly ICoreModule[] {

        return [...this.registry.values()];

    }

}
