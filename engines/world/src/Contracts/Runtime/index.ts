export type RuntimeHealthStatus = "healthy" | "degraded" | "unhealthy" | "failed";

export interface WorkerHealthReport {
    readonly workerName: string;
    readonly isRunning: boolean;
    readonly lastTickDurationMs: number;
    readonly failureCount: number;
    readonly lastError?: string;
    readonly status: RuntimeHealthStatus;
}

export interface RuntimeHealthReport {
    readonly status: RuntimeHealthStatus;
    readonly runtimeState: string;
    readonly uptimeMs: number;
    readonly tickCount: number;
    readonly workers: WorkerHealthReport[];
    readonly checks: HealthCheckReport[];
    readonly timestamp: number;
}

export interface HealthCheckReport {
    readonly name: string;
    readonly healthy: boolean;
    readonly message?: string;
    readonly durationMs: number;
}

export interface WorldRuntimeStateChangedEvent {
    readonly previousState: string;
    readonly currentState: string;
    readonly worldId: string;
    readonly timestamp: number;
}

export interface WorkerLifecycleEvent {
    readonly workerName: string;
    readonly previousState: string;
    readonly currentState: string;
    readonly timestamp: number;
}

export type WorkerState = "stopped" | "initializing" | "running" | "paused" | "terminated";

export interface RuntimeConfiguration {
    readonly tickIntervalMs: number;
    readonly enableRealtimeWeatherSimulation: boolean;
    readonly enableNpcSpatialTracking: boolean;
    readonly snapshotCadenceTicks: number;
    readonly cleanupIntervalMs: number;
    readonly projectionSyncIntervalMs: number;
    readonly eventScheduleIntervalMs: number;
    readonly maxConsecutiveFailures: number;
    readonly recoveryTimeoutMs: number;
}

export * from "./IWorldRuntime";
export * from "./WorldRuntimeState";
