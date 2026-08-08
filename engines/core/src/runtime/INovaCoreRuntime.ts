import { ICoreModule } from "../modules/ICoreModule";
import { IContainer } from "../container/IContainer";
import { IEventBus } from "../events/IEventBus";
import { RuntimeState } from "./RuntimeState";

export interface INovaCoreRuntime {

    initialize(): Promise<void>;

    shutdown(): Promise<void>;

    registerModule(
        module: ICoreModule
    ): void;

    resolve<T>(
        serviceIdentifier: symbol
    ): T;

    getEventBus(): IEventBus;

    getContainer(): IContainer;

    getState(): RuntimeState;

    getRegisteredModules(): readonly ICoreModule[];

}