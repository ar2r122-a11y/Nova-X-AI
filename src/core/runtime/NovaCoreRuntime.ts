import { INovaRuntime } from "../contracts/INovaRuntime";
import { RuntimeConfiguration } from "./RuntimeConfiguration";
import { RuntimeState } from "./RuntimeState";

export class NovaCoreRuntime implements INovaRuntime {

    private state: RuntimeState = RuntimeState.Uninitialized;

    public async initialize(
        _configuration: RuntimeConfiguration
    ): Promise<void> {

        this.state = RuntimeState.Bootstrapping;

        this.state = RuntimeState.Running;
    }

    public async shutdown(): Promise<void> {

        this.state = RuntimeState.ShuttingDown;

        this.state = RuntimeState.Terminated;
    }

    public getState(): RuntimeState {

        return this.state;

    }

}