import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker } from "./BaseWorldWorker";

export class SnapshotWorker extends BaseWorldWorker {
    private lastTickCount = 0;

    constructor() {
        super(5000);
    }

    getWorkerName(): string {
        return "SnapshotWorker";
    }

    protected async tickImpl(): Promise<void> {
        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();
        const config = this.getConfig();

        const state = await engine.getWorldState(worldId);
        if (!state || state.state === "archived") return;

        const tickCount = state.version;
        if (tickCount > 0 && tickCount % config.snapshotCadenceTicks === 0 && tickCount !== this.lastTickCount) {
            this.lastTickCount = tickCount;
            try {
                await engine.takeSnapshot(worldId);
            } catch {
                const snapshotManager = engine.snapshotManager;
                if (snapshotManager) {
                    const _snapshot = await snapshotManager.takeSnapshot(worldId);
                }
            }
        }
    }
}
