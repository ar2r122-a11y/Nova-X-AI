export interface IProviderHealthCheck {
    readonly providerId: string;
    readonly status: import("./Runtime/index").RuntimeHealthStatus;
    readonly latencyMs: number;
    readonly lastChecked: number;
    readonly errorCount: number;
    readonly successCount: number;
}

export interface HealthCheckReport {
    readonly name: string;
    readonly healthy: boolean;
    readonly message?: string;
    readonly durationMs: number;
}
