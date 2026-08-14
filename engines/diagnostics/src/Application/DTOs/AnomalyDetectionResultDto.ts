export interface AnomalyDetectionResultDto {
    readonly id: string;
    readonly engineName: string;
    readonly anomalyType: string;
    readonly severity: "low" | "medium" | "high" | "critical";
    readonly message: string;
    readonly detectedAt: number;
    readonly context: Record<string, unknown>;
    readonly resolved: boolean;
}
