import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker } from "./BaseWorldWorker";

export class EventSchedulerWorker extends BaseWorldWorker {
    constructor() {
        super(5000);
    }

    getWorkerName(): string {
        return "EventSchedulerWorker";
    }

    protected async tickImpl(): Promise<void> {
        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();

        const state = await engine.getWorldState(worldId);
        if (!state || state.state !== "simulation_running") return;
    }
}
