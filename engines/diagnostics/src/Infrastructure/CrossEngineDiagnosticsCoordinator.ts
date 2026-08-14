import type { IHealthProbe } from "../Domain/Services/IHealthProbe";
import type { ILogVault } from "../Domain/Services/ILogVault";
import type { IDiagnosticsEngine } from "../Contracts";

export class CrossEngineDiagnosticsCoordinator {
    private readonly engineProbes = new Map<string, IHealthProbe>();

    constructor(
        private readonly diagnosticsEngine: IDiagnosticsEngine,
        private readonly logVault: ILogVault
    ) {}

    registerEngineProbe(engineName: string, probe: IHealthProbe): void {
        this.engineProbes.set(engineName, probe);
    }

    async runFullDiagnostics(): Promise<{
        healthy: boolean;
        engineCount: number;
        healthyEngineCount: number;
        anomalies: Array<{
            engineName: string;
            anomalyType: string;
            severity: string;
            message: string;
        }>;
        logVaultUsage: {
            usedBytes: number;
            quotaBytes: number;
            entryCount: number;
        };
        generatedAt: number;
    }> {
        const engineProbes = Array.from(this.engineProbes.values());
        let healthyEngineCount = 0;
        const anomalies: Array<{
            engineName: string;
            anomalyType: string;
            severity: string;
            message: string;
        }> = [];

        for (const probe of engineProbes) {
            try {
                const result = await probe.check();
                if (result.healthy) {
                    healthyEngineCount++;
                } else {
                    anomalies.push({
                        engineName: probe.name,
                        anomalyType: "health_probe_failed",
                        severity: "medium",
                        message: result.message ?? "Health check failed"
                    });
                }

                await this.logVault.append({
                    level: result.healthy ? "info" : "error",
                    message: `Health probe for ${probe.name}: ${result.healthy ? "healthy" : "unhealthy"}`,
                    engine: "diagnostics",
                    metadata: { durationMs: result.durationMs }
                });
            } catch (error) {
                anomalies.push({
                    engineName: probe.name,
                    anomalyType: "health_probe_exception",
                    severity: "high",
                    message: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        const logVaultUsage = await this.logVault.getQuotaUsage();

        return {
            healthy: anomalies.length === 0,
            engineCount: engineProbes.length,
            healthyEngineCount,
            anomalies,
            logVaultUsage,
            generatedAt: Date.now()
        };
    }
}
