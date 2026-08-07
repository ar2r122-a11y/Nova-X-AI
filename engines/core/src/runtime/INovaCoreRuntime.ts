import { ICoreModule } from "../modules/ICoreModule";
import { IEventBus } from "../events/IEventBus";

export interface INovaCoreRuntime {

    initialize(): Promise<void>;

    shutdown(): Promise<void>;

    registerModule(
        module: ICoreModule
    ): void;

    resolve<T>(
        serviceIdentifier: string | symbol
    ): T;

    getEventBus(): IEventBus;

}