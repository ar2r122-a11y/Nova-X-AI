import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker, WorkerContext } from "./BaseWorldWorker";
import { WorldId } from "../../Domain/ValueObjects/WorldId";

export class ClockWorker extends BaseWorldWorker {
    constructor() {
        super(1000);
    }

    async start(): Promise<void> {
        await super.start();
    }

    getWorkerName(): string {
        return "ClockWorker";
    }

    protected async tickImpl(): Promise<void> {
        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();
        const config = this.getConfig();

        const state = await engine.getWorldState(worldId);
        if (!state || state.state !== "simulation_running") return;

        const tickDurationSeconds = config.tickIntervalMs / 1000;
        await engine.advanceTime(worldId, tickDurationSeconds);
    }
}
