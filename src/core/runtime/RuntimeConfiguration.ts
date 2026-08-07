export interface RuntimeConfiguration {
    readonly environment: "development" | "production";

    readonly maxBackgroundWorkers: number;

    readonly eventBusQueueLimit: number;

    readonly enableFaultIsolation: boolean;
}