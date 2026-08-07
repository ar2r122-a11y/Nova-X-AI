/**
 * Nova X AI
 * Runtime Configuration
 */

export interface RuntimeConfiguration {

    applicationName: string;

    version: string;

    environment: string;

    debug: boolean;

    enableTelemetry: boolean;

    enableDiagnostics: boolean;

    enableAnalytics: boolean;

}