/**
 * Nova X AI
 * Nova Core
 * Runtime Configuration
 */

export interface RuntimeConfiguration {

    readonly applicationName: string;

    readonly version: string;

    readonly environment: string;

    readonly debug: boolean;

    readonly enableTelemetry: boolean;

    readonly enableDiagnostics: boolean;

    readonly enableAnalytics: boolean;

    readonly maxBackgroundWorkers: number;

    readonly eventBusQueueLimit: number;

}