import { RuntimeConfiguration } from "../runtime/RuntimeConfiguration";
import { RuntimeState } from "../runtime/RuntimeState";

export interface INovaRuntime {

    initialize(
        configuration: RuntimeConfiguration
    ): Promise<void>;

    shutdown(): Promise<void>;

    getState(): RuntimeState;

}