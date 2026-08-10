import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker } from "./BaseWorldWorker";

export class ProjectionWorker extends BaseWorldWorker {
    private lastRebuildVersion = -1;

    constructor() {
        super(30000);
    }

    getWorkerName(): string {
        return "ProjectionWorker";
    }

    protected async tickImpl(): Promise<void> {
        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();

        const state = await engine.getWorldState(worldId);
        if (!state) return;

        if (state.state === "failed" || state.state === "recovering") {
            if (this.lastRebuildVersion !== state.version) {
                this.lastRebuildVersion = state.version;
            }
        }
    }
}
