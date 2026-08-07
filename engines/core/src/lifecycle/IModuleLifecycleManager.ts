import { ICoreModule } from "../modules/ICoreModule";

export interface IModuleLifecycleManager {

    register(
        module: ICoreModule
    ): void;

    initializeModules(): Promise<void>;

    shutdownModules(): Promise<void>;

    getModules(): readonly ICoreModule[];

}