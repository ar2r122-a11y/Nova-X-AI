import type { IQueryHandler } from "@nova-x-ai/core";
import type { GetDiagnosticSnapshotQuery } from "../Queries/GetDiagnosticSnapshotQuery";
import type { DiagnosticSnapshotDto } from "../DTOs/DiagnosticSnapshotDto";

export class GetDiagnosticSnapshotHandler implements IQueryHandler<GetDiagnosticSnapshotQuery, DiagnosticSnapshotDto> {
    constructor(
        private readonly healthProbe: {
            probeAll(): Promise<Array<{
                engineName: string;
                healthy: boolean;
                durationMs: number;
                message: string | null;
            }>>;
        },
        private readonly anomalyDetector: {
            getUnresolved(): Promise<Array<{
                id: string;
                engineName: string;
                anomalyType: string;
                severity: string;
                message: string;
                detectedAt: number;
            }>>;
        },
        private readonly logVault: {
            getQuotaUsage(): Promise<{
                usedBytes: number;
                quotaBytes: number;
                entryCount: number;
            }>;
        }
    ) {}

    public async handle(_query: GetDiagnosticSnapshotQuery): Promise<DiagnosticSnapshotDto> {
        const healthReports = await this.healthProbe.probeAll();
        const anomalies = await this.anomalyDetector.getUnresolved();
        const logVaultUsage = await this.logVault.getQuotaUsage();

        return {
            snapshotId: `snapshot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            capturedAt: Date.now(),
            engine: "diagnostics",
            healthMetrics: healthReports,
            anomalies: anomalies.map(a => ({
                id: a.id,
                engineName: a.engineName,
                anomalyType: a.anomalyType,
                severity: a.severity as "low" | "medium" | "high" | "critical",
                message: a.message,
                detectedAt: a.detectedAt,
                context: {},
                resolved: false
            })),
            activeSpans: 0,
            logVault: logVaultUsage
        };
    }
}
