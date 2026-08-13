import type { IEventBus } from "@nova-x-ai/core";
import { MetricType } from "../Domain/ValueObjects/MetricType";

export interface IAnalyticsEngine {
    readonly eventBus: IEventBus;
    recordMetric(command: RecordMetricCommand): Promise<MetricAcknowledgementDto>;
    recordTelemetryEvent(command: RecordTelemetryEventCommand): Promise<MetricAcknowledgementDto>;
    getMetrics(query: GetMetricsQuery): Promise<MetricDto[]>;
    getTelemetryEvents(query: GetTelemetryEventsQuery): Promise<TelemetryEventDto[]>;
    getFeatureUsage(query: GetFeatureUsageQuery): Promise<FeatureUsageMetricDto[]>;
    getPerformanceMetrics(query: GetPerformanceMetricsQuery): Promise<PerformanceMetricDto[]>;
    getSettings(query: GetAnalyticsSettingsQuery): Promise<AnalyticsSettingsDto>;
    updatePrivacySettings(command: UpdatePrivacySettingsCommand): Promise<AnalyticsSettingsDto>;
    setOptOut(command: SetOptOutCommand): Promise<AnalyticsSettingsDto>;
    purge(command: PurgeCommand): Promise<PurgeResultDto>;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}

export interface RecordMetricCommand {
    readonly type: MetricType;
    readonly name: string;
    readonly value: number;
    readonly unit: string;
    readonly tags: string[];
    readonly featureTag?: string;
    readonly performanceTag?: string;
    readonly sessionId?: string;
    readonly engineSource?: string;
    readonly correlationId?: string;
}

export interface RecordTelemetryEventCommand {
    readonly eventType: string;
    readonly payload: Record<string, unknown>;
    readonly correlationId?: string;
    readonly engineSource?: string;
}

export interface GetMetricsQuery {
    readonly metricType?: MetricType;
    readonly startTime?: number;
    readonly endTime?: number;
    readonly limit: number;
    readonly requesterId: string;
}

export interface GetTelemetryEventsQuery {
    readonly eventType?: string;
    readonly startTime?: number;
    readonly endTime?: number;
    readonly limit: number;
    readonly requesterId: string;
}

export interface GetFeatureUsageQuery {
    readonly feature?: string;
    readonly startTime?: number;
    readonly endTime?: number;
    readonly limit: number;
    readonly requesterId: string;
}

export interface GetPerformanceMetricsQuery {
    readonly performanceTag?: string;
    readonly startTime?: number;
    readonly endTime?: number;
    readonly limit: number;
    readonly requesterId: string;
}

export interface GetAnalyticsSettingsQuery {
    readonly requesterId: string;
}

export interface UpdatePrivacySettingsCommand {
    readonly piiStrippingEnabled: boolean;
    readonly promptTextHashingEnabled: boolean;
    readonly ipAnonymizationEnabled: boolean;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface SetOptOutCommand {
    readonly optedOut: boolean;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface PurgeCommand {
    readonly olderThanDays: number;
    readonly claims: { roles: string[]; permissions: string[] };
}

export interface MetricAcknowledgementDto {
    readonly metricId: string;
    readonly recordedAt: number;
    readonly accepted: boolean;
}

export interface MetricDto {
    readonly metricId: string;
    readonly type: string;
    readonly name: string;
    readonly value: number;
    readonly unit: string;
    readonly tags: string[];
    readonly featureTag?: string;
    readonly performanceTag?: string;
    readonly piiMasked: boolean;
    readonly recordedAt: number;
    readonly sessionId?: string;
    readonly engineSource?: string;
    readonly correlationId?: string;
}

export interface TelemetryEventDto {
    readonly eventId: string;
    readonly eventType: string;
    readonly payload: Record<string, unknown>;
    readonly piiMasked: boolean;
    readonly timestamp: number;
    readonly correlationId?: string;
    readonly engineSource?: string;
}

export interface AnalyticsSettingsDto {
    readonly optedOut: boolean;
    readonly rawRetentionDays: number;
    readonly summaryRetentionDays: number;
    readonly piiStrippingEnabled: boolean;
    readonly promptTextHashingEnabled: boolean;
    readonly ipAnonymizationEnabled: boolean;
    readonly updatedAt: number;
}

export interface FeatureUsageMetricDto {
    readonly feature: string;
    readonly count: number;
    readonly totalValue: number;
    readonly averageValue: number;
}

export interface PerformanceMetricDto {
    readonly tag: string;
    readonly count: number;
    readonly averageValue: number;
    readonly maxValue: number;
}

export interface PurgeResultDto {
    readonly metricsPurged: number;
    readonly telemetryPurged: number;
    readonly executedAt: number;
}

export interface AnalyticsBudgetDto {
    readonly hardRamBytes: number;
    readonly softRamBytes: number;
    readonly maxStorageBytes: number;
    readonly maxIngestionPerSecond: number;
    readonly exportTimeoutMs: number;
    readonly exportBandwidthBps: number;
}
