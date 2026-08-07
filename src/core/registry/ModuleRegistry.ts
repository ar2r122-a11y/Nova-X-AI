export class ModuleRegistry {

    private readonly modules = new Map<string, unknown>();

    public register(name: string, module: unknown): void {

        this.modules.set(name, module);

    }

    public resolve<T>(name: string): T | undefined {

        return this.modules.get(name) as T | undefined;

    }

    public has(name: string): boolean {

        return this.modules.has(name);

    }

    public getAll(): Map<string, unknown> {

        return this.modules;

    }

}