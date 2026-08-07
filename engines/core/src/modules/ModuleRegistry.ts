import { ICoreModule } from "./ICoreModule";

export class ModuleRegistry {

    private readonly modules = new Map<string, ICoreModule>();

    public register(
        module: ICoreModule
    ): void {

        if (this.modules.has(module.moduleName)) {
            throw new Error(
                `Module '${module.moduleName}' is already registered.`
            );
        }

        this.modules.set(
            module.moduleName,
            module
        );

    }

    public get(
        moduleName: string
    ): ICoreModule | undefined {

        return this.modules.get(moduleName);

    }

    public getAll(): ICoreModule[] {

        return [...this.modules.values()];

    }

    public has(
        moduleName: string
    ): boolean {

        return this.modules.has(moduleName);

    }

    public remove(
        moduleName: string
    ): boolean {

        return this.modules.delete(moduleName);

    }

    public clear(): void {

        this.modules.clear();

    }

}