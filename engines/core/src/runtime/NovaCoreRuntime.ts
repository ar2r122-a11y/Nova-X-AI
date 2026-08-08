import { INovaCoreRuntime } from "./INovaCoreRuntime";
import { RuntimeConfiguration } from "./RuntimeConfiguration";
import { RuntimeState } from "./RuntimeState";

import { IContainer } from "../container/IContainer";
import { Container } from "../container/Container";

import { IEventBus } from "../events/IEventBus";
import { EventBus } from "../events/EventBus";

import { ModuleRegistry } from "../modules/ModuleRegistry";
import { ICoreModule } from "../modules/ICoreModule";

export class NovaCoreRuntime implements INovaCoreRuntime {

    private readonly container: IContainer;

    private readonly eventBus: IEventBus;

    private readonly moduleRegistry: ModuleRegistry;

    private state: RuntimeState;

    constructor(
        private readonly configuration: RuntimeConfiguration
    ) {

        this.container = new Container();

        this.eventBus = new EventBus();

        this.moduleRegistry = new ModuleRegistry();

        this.state = RuntimeState.Created;

    }

    public async initialize(): Promise<void> {

        if (this.state !== RuntimeState.Created) {
            return;
        }

        this.state = RuntimeState.Initializing;

        const modules = this.moduleRegistry.getAll();

        for (const module of modules) {

            module.configureServices(
                this.container
            );

        }

        for (const module of modules) {

            await module.onInit();

        }

        this.state = RuntimeState.Running;

    }

    public async shutdown(): Promise<void> {

        if (this.state !== RuntimeState.Running) {
            return;
        }

        this.state = RuntimeState.Stopping;

        const modules = [...this.moduleRegistry.getAll()].reverse();

        for (const module of modules) {

            await module.onDestroy();

        }

        this.state = RuntimeState.Stopped;

    }

    public registerModule(
        module: ICoreModule
    ): void {

        this.moduleRegistry.register(
            module
        );

    }

    public getRegisteredModules(): readonly ICoreModule[] {

        return this.moduleRegistry.getAll();

    }

    public resolve<T>(
        serviceIdentifier: symbol
    ): T {

        return this.container.resolve<T>(
            serviceIdentifier
        );

    }

    public getEventBus(): IEventBus {

        return this.eventBus;

    }

    public getContainer(): IContainer {

        return this.container;

    }

    public getState(): RuntimeState {

        return this.state;

    }

}
