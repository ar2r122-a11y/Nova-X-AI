export interface DiagnosticsBudgetDto {
    readonly maxSpans: number;
    readonly activeSpans: number;
    readonly logVaultQuotaBytes: number;
    readonly logVaultUsedBytes: number;
    readonly telemetryBufferBytes: number;
    readonly telemetryBufferUsedBytes: number;
    readonly metricSampleFrequencyMs: number;
    readonly profileTimeoutMs: number;
    readonly maxRetries: number;
}
