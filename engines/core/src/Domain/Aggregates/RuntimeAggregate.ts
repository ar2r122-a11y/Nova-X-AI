import { ModuleRegistrationEntity } from "../Entities/ModuleRegistrationEntity";

export class RuntimeAggregate {
    private readonly modules = new Map<string, ModuleRegistrationEntity>();

    public registerModule(module: ModuleRegistrationEntity): void {
        if (this.modules.has(module.moduleName)) {
            throw new Error(
                `Module '${module.moduleName}' is already registered.`
            );
        }

        this.modules.set(module.moduleName, module);
    }

    public unregisterModule(moduleName: string): boolean {
        return this.modules.delete(moduleName);
    }

    public getModule(
        moduleName: string
    ): ModuleRegistrationEntity | undefined {
        return this.modules.get(moduleName);
    }

    public getModules(): readonly ModuleRegistrationEntity[] {
        return [...this.modules.values()];
    }

    public hasModule(moduleName: string): boolean {
        return this.modules.has(moduleName);
    }

    public clear(): void {
        this.modules.clear();
    }

    public count(): number {
        return this.modules.size;
    }
}