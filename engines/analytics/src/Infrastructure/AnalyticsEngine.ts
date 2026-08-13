import type { IEventBus } from "@nova-x-ai/core";
import type { IAnalyticsEngine } from "../Contracts/IAnalyticsEngine";
import type { IMetricRepository } from "../Domain/Repositories/IMetricRepository";
import type { ITelemetryEventRepository } from "../Domain/Repositories/ITelemetryEventRepository";
import type { IAnalyticsSettingsRepository } from "../Domain/Repositories/IAnalyticsSettingsRepository";
import { RecordMetricCommandHandler } from "../Application/Handlers/RecordMetricCommandHandler";
import { RecordTelemetryEventCommandHandler } from "../Application/Handlers/RecordTelemetryEventCommandHandler";
import { PurgeCommandHandler } from "../Application/Handlers/PurgeCommandHandler";
import { UpdatePrivacySettingsCommandHandler } from "../Application/Handlers/UpdatePrivacySettingsCommandHandler";
import { SetOptOutCommandHandler } from "../Application/Handlers/SetOptOutCommandHandler";
import { GetMetricsQueryHandler } from "../Application/Handlers/GetMetricsQueryHandler";
import { GetTelemetryEventsQueryHandler } from "../Application/Handlers/GetTelemetryEventsQueryHandler";
import { GetFeatureUsageQueryHandler } from "../Application/Handlers/GetFeatureUsageQueryHandler";
import { GetPerformanceMetricsQueryHandler } from "../Application/Handlers/GetPerformanceMetricsQueryHandler";
import { GetAnalyticsSettingsQueryHandler } from "../Application/Handlers/GetAnalyticsSettingsQueryHandler";
import { RecordMetricCommand } from "../Application/Commands/RecordMetricCommand";
import { RecordTelemetryEventCommand } from "../Application/Commands/RecordTelemetryEventCommand";
import { PurgeCommand } from "../Application/Commands/PurgeCommand";
import { UpdatePrivacySettingsCommand } from "../Application/Commands/UpdatePrivacySettingsCommand";
import { SetOptOutCommand } from "../Application/Commands/SetOptOutCommand";
import { GetMetricsQuery } from "../Application/Queries/GetMetricsQuery";
import { GetTelemetryEventsQuery } from "../Application/Queries/GetTelemetryEventsQuery";
import { GetFeatureUsageQuery } from "../Application/Queries/GetFeatureUsageQuery";
import { GetPerformanceMetricsQuery } from "../Application/Queries/GetPerformanceMetricsQuery";
import { GetAnalyticsSettingsQuery } from "../Application/Queries/GetAnalyticsSettingsQuery";
import { MetricAcknowledgementDto } from "../Application/DTO/MetricAcknowledgementDto";
import { MetricDto } from "../Application/DTO/MetricDto";
import { TelemetryEventDto } from "../Application/DTO/TelemetryEventDto";
import { FeatureUsageMetricDto } from "../Application/DTO/FeatureUsageMetricDto";
import { PerformanceMetricDto } from "../Application/DTO/PerformanceMetricDto";
import { AnalyticsSettingsDto } from "../Application/DTO/AnalyticsSettingsDto";
import { PurgeResultDto } from "../Application/DTO/PurgeResultDto";
import { AnalyticsBudgetDto } from "../Application/DTO/AnalyticsBudgetDto";
import { SchedulerWorker } from "./Workers/SchedulerWorker";

export class AnalyticsEngine implements IAnalyticsEngine {
    readonly eventBus: IEventBus;
    private metricRepository: IMetricRepository;
    private telemetryEventRepository: ITelemetryEventRepository;
    private settingsRepository: IAnalyticsSettingsRepository;
    private workers: import("./Workers/SchedulerWorker").IAnalyticsWorker[] = [];
    private initialized = false;

    constructor(
        eventBus: IEventBus,
        metricRepository: IMetricRepository,
        telemetryEventRepository: ITelemetryEventRepository,
        settingsRepository: IAnalyticsSettingsRepository
    ) {
        this.eventBus = eventBus;
        this.metricRepository = metricRepository;
        this.telemetryEventRepository = telemetryEventRepository;
        this.settingsRepository = settingsRepository;
    }

    async recordMetric(command: RecordMetricCommand): Promise<MetricAcknowledgementDto> {
        const handler = new RecordMetricCommandHandler(this.eventBus, this.metricRepository, this.settingsRepository);
        return handler.handle(command);
    }

    async recordTelemetryEvent(command: RecordTelemetryEventCommand): Promise<MetricAcknowledgementDto> {
        const handler = new RecordTelemetryEventCommandHandler(
            this.eventBus,
            this.telemetryEventRepository,
            this.settingsRepository,
            new (await import("../Domain/Services/TelemetryIngestionService")).TelemetryIngestionService()
        );
        return handler.handle(command);
    }

    async getMetrics(query: GetMetricsQuery): Promise<MetricDto[]> {
        const handler = new GetMetricsQueryHandler(this.metricRepository);
        return handler.handle(query);
    }

    async getTelemetryEvents(query: GetTelemetryEventsQuery): Promise<TelemetryEventDto[]> {
        const handler = new GetTelemetryEventsQueryHandler(this.telemetryEventRepository);
        return handler.handle(query);
    }

    async getFeatureUsage(query: GetFeatureUsageQuery): Promise<FeatureUsageMetricDto[]> {
        const handler = new GetFeatureUsageQueryHandler(this.metricRepository, new (await import("../Domain/Services/MetricAggregationService")).MetricAggregationService());
        return handler.handle(query);
    }

    async getPerformanceMetrics(query: GetPerformanceMetricsQuery): Promise<PerformanceMetricDto[]> {
        const handler = new GetPerformanceMetricsQueryHandler(this.metricRepository, new (await import("../Domain/Services/MetricAggregationService")).MetricAggregationService());
        return handler.handle(query);
    }

    async getSettings(query: GetAnalyticsSettingsQuery): Promise<AnalyticsSettingsDto> {
        const handler = new GetAnalyticsSettingsQueryHandler(this.settingsRepository);
        return handler.handle(query);
    }

    async updatePrivacySettings(command: UpdatePrivacySettingsCommand): Promise<AnalyticsSettingsDto> {
        const handler = new UpdatePrivacySettingsCommandHandler(this.settingsRepository);
        return handler.handle(command);
    }

    async setOptOut(command: SetOptOutCommand): Promise<AnalyticsSettingsDto> {
        const handler = new SetOptOutCommandHandler(this.eventBus, this.settingsRepository);
        return handler.handle(command);
    }

    async purge(command: PurgeCommand): Promise<PurgeResultDto> {
        const handler = new PurgeCommandHandler(this.metricRepository, this.telemetryEventRepository);
        return handler.handle(command);
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;

        const schedulerWorker = new SchedulerWorker(
            this.metricRepository,
            this.telemetryEventRepository,
            this.settingsRepository
        );

        await schedulerWorker.start();
        this.workers.push(schedulerWorker);
        this.initialized = true;
    }

    async shutdown(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.initialized = false;
    }

    getBudget(): AnalyticsBudgetDto {
        return new AnalyticsBudgetDto(
            32 * 1024 * 1024,
            24 * 1024 * 1024,
            500 * 1024 * 1024,
            1000,
            30000,
            64000
        );
    }
}
