import { NovaCoreRuntime } from "./NovaCoreRuntime";
import { RuntimeState } from "./RuntimeState";

import { ModuleRegistry } from "../modules/ModuleRegistry";
import { ModuleLifecycleManager } from "../lifecycle/ModuleLifecycleManager";

export class RuntimeManager {

    constructor(
        private readonly runtime: NovaCoreRuntime,
        private readonly registry: ModuleRegistry,
        private readonly lifecycleManager: ModuleLifecycleManager
    ) {}

    public async start(): Promise<void> {

        if (this.runtime.getState() !== RuntimeState.Created) {
            return;
        }

        for (const module of this.registry.getAll()) {
            this.lifecycleManager.register(module);
        }

        await this.runtime.initialize();

    }

    public async stop(): Promise<void> {

        if (this.runtime.getState() !== RuntimeState.Running) {
            return;
        }

        await this.runtime.shutdown();

    }

    public getRuntime(): NovaCoreRuntime {

        return this.runtime;

    }

}