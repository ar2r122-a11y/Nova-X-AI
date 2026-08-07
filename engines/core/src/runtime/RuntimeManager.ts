import { RuntimeState } from "./RuntimeState";
import { RuntimeConfiguration } from "./RuntimeConfiguration";

export class RuntimeManager {

    private state: RuntimeState =
        RuntimeState.Created;

    constructor(
        private readonly configuration: RuntimeConfiguration
    ) {}

    public getConfiguration(): RuntimeConfiguration {

        return this.configuration;

    }

    public getState(): RuntimeState {

        return this.state;

    }

    public async initialize(): Promise<void> {

        this.state = RuntimeState.Initializing;

        this.state = RuntimeState.Running;

    }

    public async shutdown(): Promise<void> {

        this.state = RuntimeState.Stopping;

        this.state = RuntimeState.Stopped;

    }

}