export interface KernelHealthCheckDto {
    runtimeVersion: string;

    registeredModules: number;

    runningModules: number;

    failedModules: number;

    healthy: boolean;

    timestamp: number;
}