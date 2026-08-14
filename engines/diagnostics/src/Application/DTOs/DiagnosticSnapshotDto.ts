import type { AnomalyDetectionResultDto } from "./AnomalyDetectionResultDto";

export interface DiagnosticSnapshotDto {
    readonly snapshotId: string;
    readonly capturedAt: number;
    readonly engine: string;
    readonly healthMetrics: {
        engineName: string;
        healthy: boolean;
        durationMs: number;
        message: string | null;
    }[];
    readonly anomalies: AnomalyDetectionResultDto[];
    readonly activeSpans: number;
    readonly logVault: {
        usedBytes: number;
        quotaBytes: number;
        entryCount: number;
    };
}
