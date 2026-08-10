import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { RuntimeConfiguration } from "../../Contracts/Runtime/index";
import { BaseWorldWorker } from "./BaseWorldWorker";

export class CleanupWorker extends BaseWorldWorker {
    constructor() {
        super(3600000);
    }

    getWorkerName(): string {
        return "CleanupWorker";
    }

    protected async tickImpl(): Promise<void> {
        const engine = this.getEngine();
        const worldId = this.getWorldId().getValue();

        const state = await engine.getWorldState(worldId);
        if (!state) return;

        if (state.state === "archived") {
            const snapshotManager = engine.snapshotManager;
            if (snapshotManager) {
                const snapshots = await snapshotManager.listSnapshots(worldId);
                if (snapshots.length > 10) {
                    for (let i = 0; i < snapshots.length - 10; i++) {
                        await snapshotManager.deleteSnapshot(worldId, snapshots[i].timestamp);
                    }
                }
            }
        }
    }
}
