import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { IWorldWorker } from "../../Contracts/Workers/IWorldWorker";
import type { IWorldHealthCheck } from "../../Contracts/Health/IWorldHealthCheck";

export class WorldHealthCheck implements IWorldHealthCheck {
    readonly name = "WorldEngineHealthCheck";

    constructor(private readonly engine: IWorldEngine, private readonly workers: IWorldWorker[] = []) {}

    async check(): Promise<{ healthy: boolean; message?: string; durationMs: number }> {
        const start = Date.now();

        try {
            const state = await this.engine.getWorldState("__health__");
            if (!state) {
                return {
                    healthy: false,
                    message: "World state is not available",
                    durationMs: Date.now() - start
                };
            }

            const workerReports = this.workers.map(w => w.getHealth());
            const unhealthyWorkers = workerReports.filter(r => r.status === "unhealthy");
            if (unhealthyWorkers.length > 0) {
                return {
                    healthy: false,
                    message: `Unhealthy workers: ${unhealthyWorkers.map(w => w.workerName).join(", ")}`,
                    durationMs: Date.now() - start
                };
            }

            return {
                healthy: true,
                durationMs: Date.now() - start
            };
        } catch (error) {
            return {
                healthy: false,
                message: error instanceof Error ? error.message : "Health check failed",
                durationMs: Date.now() - start
            };
        }
    }
}
