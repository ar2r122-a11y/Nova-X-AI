import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IAudioStreamingWorker } from "../../Contracts/IAudioStreamingWorker";

export interface VoiceHealthReport {
    readonly status: "healthy" | "degraded" | "unhealthy";
    readonly runtimeState: string;
    readonly uptimeMs: number;
    readonly workers: IAudioStreamingWorker["getHealth"][];
    readonly checks: { name: string; healthy: boolean; message?: string; durationMs: number }[];
    readonly timestamp: number;
}

export class VoiceHealthCheck {
    constructor(private readonly engine: IVoiceEngine, private readonly workers: IAudioStreamingWorker[]) {}

    async check(): Promise<VoiceHealthReport> {
        const workerReports = this.workers.map(w => w.getHealth());
        const checks = workerReports.map(w => ({
            name: w.workerName,
            healthy: w.status === "healthy",
            message: w.lastError,
            durationMs: w.lastTickDurationMs
        }));

        const allHealthy = workerReports.every(w => w.status === "healthy");
        const anyDegraded = workerReports.some(w => w.status === "degraded");

        return {
            status: allHealthy ? "healthy" : anyDegraded ? "degraded" : "unhealthy",
            runtimeState: "unknown",
            uptimeMs: 0,
            workers: workerReports as any,
            checks,
            timestamp: Date.now()
        };
    }
}
