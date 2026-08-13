import type { IEventBus } from "@nova-x-ai/core";
import { RecordMetricCommand } from "../Commands/RecordMetricCommand";
import { MetricAcknowledgementDto } from "../DTO/MetricAcknowledgementDto";
import { MetricRecordedEvent } from "../../Domain/Events/MetricRecordedEvent";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";
import { MetricAggregate } from "../../Domain/Aggregates/MetricAggregate";

export class RecordMetricCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly metricRepository: IMetricRepository,
        private readonly settingsRepository: IAnalyticsSettingsRepository
    ) {}

    async handle(command: RecordMetricCommand): Promise<MetricAcknowledgementDto> {
        const settings = await this.settingsRepository.getSettings();
        if (!settings) {
            throw new Error("Analytics settings not initialized.");
        }

        if (!PrivacyPolicy.canRecordMetric(settings.getOptOutStatus().isOptedOut())) {
            throw new Error("Analytics is opted out. Cannot record metrics.");
        }

        if (typeof command.value !== "number" || !isFinite(command.value)) {
            throw new Error("Metric value must be a finite number.");
        }

        if (typeof command.name !== "string" || command.name.trim().length === 0) {
            throw new Error("Metric name is required.");
        }

        const aggregate = MetricAggregate.reconstitute({
            metrics: await this.metricRepository.getAll(),
            telemetryEvents: [],
            settings: { optOutStatus: settings.getOptOutStatus() }
        });

        const metric = aggregate.recordMetric(
            command.type,
            command.name,
            command.value,
            command.unit,
            command.tags,
            command.featureTag,
            command.performanceTag,
            undefined,
            command.sessionId,
            command.engineSource,
            command.correlationId
        );

        await this.metricRepository.save(metric);

        const correlationId = command.correlationId ?? `metric-${Date.now()}`;
        await this.eventBus.publish(
            new MetricRecordedEvent(metric.getId(), command.type, command.engineSource, Date.now(), correlationId)
        );

        return new MetricAcknowledgementDto(metric.getId().getValue(), Date.now(), true);
    }
}
