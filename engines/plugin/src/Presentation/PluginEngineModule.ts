import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import { PluginEngineFacade } from "../Infrastructure/PluginEngine";
import { PluginRegistry } from "../Infrastructure/Registry/PluginRegistry";
import { SandboxLoader } from "../Infrastructure/Sandbox/SandboxLoader";

const PLUGIN_ENGINE = Symbol("PluginEngine");

export class PluginEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/plugin";
    private engine: PluginEngineFacade | null = null;

    configureServices(container: IContainer): void {
        container.registerSingleton(PLUGIN_ENGINE, PluginEngineFacade);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;

        const registry = new PluginRegistry();
        const sandbox = new SandboxLoader(eventBus);

        const engine = new PluginEngineFacade(
            eventBus,
            registry,
            sandbox
        );

        this.engine = engine;
    }

    async onDestroy(): Promise<void> {
        this.engine = null;
    }

    getEngine(): PluginEngineFacade | null {
        return this.engine;
    }
}
