export interface AnalyticsConfiguration {
    readonly hardRamBytes: number;
    readonly softRamBytes: number;
    readonly maxStorageBytes: number;
    readonly maxIngestionPerSecond: number;
    readonly exportTimeoutMs: number;
    readonly exportBandwidthBps: number;
    readonly rawRetentionDays: number;
    readonly summaryRetentionDays: number;
    readonly piiStrippingEnabled: boolean;
    readonly promptTextHashingEnabled: boolean;
    readonly ipAnonymizationEnabled: boolean;
    readonly enableOptOut: boolean;
}

export const DEFAULT_ANALYTICS_CONFIGURATION: AnalyticsConfiguration = {
    hardRamBytes: 32 * 1024 * 1024,
    softRamBytes: 24 * 1024 * 1024,
    maxStorageBytes: 500 * 1024 * 1024,
    maxIngestionPerSecond: 1000,
    exportTimeoutMs: 30000,
    exportBandwidthBps: 64000,
    rawRetentionDays: 30,
    summaryRetentionDays: 365,
    piiStrippingEnabled: true,
    promptTextHashingEnabled: true,
    ipAnonymizationEnabled: true,
    enableOptOut: true
};
