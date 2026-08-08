import { ICoreModule } from "../modules/ICoreModule";
export class ModuleFactory {

    private readonly registry = new Map<string, ICoreModule>();

    public register(module: ICoreModule): void {

        this.registry.set(module.metadata.id, module);

    }

    public create(id: string): ICoreModule {

        const module = this.registry.get(id);

        if (!module) {

            throw new Error(`Module '${id}' is not registered.`);

        }

        return module;

    }

    public getAll(): readonly ICoreModule[] {

        return [...this.registry.values()];

    }

}