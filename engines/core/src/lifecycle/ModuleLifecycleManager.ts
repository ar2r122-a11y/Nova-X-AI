import { ICoreModule } from "../modules/ICoreModule";
import { IModuleLifecycleManager } from "./IModuleLifecycleManager";

export class ModuleLifecycleManager
implements IModuleLifecycleManager {

    private readonly modules: ICoreModule[] = [];

    public register(
        module: ICoreModule
    ): void {

        this.modules.push(module);

    }

    public async initializeModules(): Promise<void> {

        for (const module of this.modules) {

            await module.onInit();

        }

    }

    public async shutdownModules(): Promise<void> {

        const modules = [...this.modules].reverse();

        for (const module of modules) {

            await module.onDestroy();

        }

    }

    public getModules(): readonly ICoreModule[] {

        return this.modules;

    }

}