export interface ProviderExecutionState {
    readonly providerId: string;
    readonly health: "healthy" | "degraded" | "unhealthy";
    readonly lastError: string | null;
    readonly latencyMs: number;
    readonly isAvailable: boolean;
    readonly fallbackUsed: boolean;
}
