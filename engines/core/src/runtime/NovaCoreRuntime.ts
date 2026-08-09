import { INovaCoreRuntime } from "./INovaCoreRuntime";
import { RuntimeConfiguration } from "./RuntimeConfiguration";
import { RuntimeState } from "./RuntimeState";

import { IContainer } from "../container/IContainer";
import { Container } from "../container/Container";

import { IEventBus } from "../events/IEventBus";
import { EventBus } from "../events/EventBus";

import { ModuleRegistry } from "../modules/ModuleRegistry";
import { ICoreModule } from "../modules/ICoreModule";

import { ModuleDependencyValidator } from "../Policies/ModuleDependencyValidator";
import { FaultIsolationPolicy } from "../Policies/FaultIsolationPolicy";

import { BackgroundScheduler } from "../scheduler/BackgroundScheduler";

import { KernelInitializedEvent } from "../events/lifecycle/KernelInitializedEvent";
import { KernelShutdownEvent } from "../events/lifecycle/KernelShutdownEvent";
import { ModuleLoadedEvent } from "../events/lifecycle/ModuleLoadedEvent";

export class NovaCoreRuntime implements INovaCoreRuntime {
    private readonly container: IContainer;

    private readonly eventBus: EventBus;

    private readonly moduleRegistry: ModuleRegistry;

    private readonly moduleDependencyValidator: ModuleDependencyValidator;

    private readonly scheduler: BackgroundScheduler;

    private readonly faultIsolationPolicy: FaultIsolationPolicy;

    private state: RuntimeState;

    constructor(
        configuration: RuntimeConfiguration
    ) {
        this.container = new Container();

        this.eventBus = new EventBus(
            configuration.eventBusQueueLimit
        );

        this.moduleRegistry = new ModuleRegistry();

        this.moduleDependencyValidator =
            new ModuleDependencyValidator();

        this.scheduler = new BackgroundScheduler(
            configuration.maxBackgroundWorkers
        );

        this.faultIsolationPolicy =
            new FaultIsolationPolicy();

        this.state = RuntimeState.Created;
    }

    public async initialize(): Promise<void> {
        if (this.state !== RuntimeState.Created) {
            return;
        }

        this.state = RuntimeState.Initializing;

        const modules =
            this.moduleDependencyValidator.sort(
                this.moduleRegistry.getAll()
            );

        const failures: string[] = [];

        for (const module of modules) {
            const success =
                await this.faultIsolationPolicy.execute(
                    async () => {
                        module.configureServices(
                            this.container
                        );
                    },
                    module.moduleName
                );

            if (!success) {
                failures.push(module.moduleName);
            }
        }

        for (const module of modules) {
            const success =
                await this.faultIsolationPolicy.execute(
                    async () => {
                        await module.onInit();
                    },
                    module.moduleName
                );

            if (!success) {
                failures.push(module.moduleName);
                continue;
            }

            await this.eventBus.publish(
                new ModuleLoadedEvent(
                    module.moduleName,
                    this.generateCorrelationId()
                )
            );
        }

        await this.scheduler.start();

        if (failures.length > 0) {
            this.state = RuntimeState.Failed;

            return;
        }

        await this.eventBus.publish(
            new KernelInitializedEvent(
                {
                    timestamp: Date.now(),
                    registeredModulesCount:
                        this.moduleRegistry.count,
                    runtimeVersion: "0.1.0"
                },
                this.generateCorrelationId()
            )
        );

        this.state = RuntimeState.Running;
    }

    public async shutdown(): Promise<void> {
        if (
            this.state !== RuntimeState.Running &&
            this.state !== RuntimeState.Failed
        ) {
            return;
        }

        this.state = RuntimeState.Stopping;

        await this.eventBus.publish(
            new KernelShutdownEvent(
                this.generateCorrelationId()
            )
        );

        await this.eventBus.shutdown();

        await this.scheduler.stop();

        const modules =
            [
                ...this.moduleRegistry.getAll()
            ].reverse();

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

    private generateCorrelationId(): string {
        return `nova-core-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }

}
