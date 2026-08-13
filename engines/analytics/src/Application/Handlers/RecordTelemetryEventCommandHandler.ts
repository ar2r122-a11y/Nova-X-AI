import type { IEventBus } from "@nova-x-ai/core";
import { RecordTelemetryEventCommand } from "../Commands/RecordTelemetryEventCommand";
import { MetricAcknowledgementDto } from "../DTO/MetricAcknowledgementDto";
import { TelemetryIngestionService } from "../../Domain/Services/TelemetryIngestionService";
import { MetricAggregate } from "../../Domain/Aggregates/MetricAggregate";
import { PIIStrippedEvent } from "../../Domain/Events/PIIStrippedEvent";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import type { ITelemetryEventRepository } from "../../Domain/Repositories/ITelemetryEventRepository";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";
import { TelemetryEvent } from "../../Domain/Entities/TelemetryEvent";
import { PIIMask } from "../../Domain/ValueObjects/PIIMask";

export class RecordTelemetryEventCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly telemetryEventRepository: ITelemetryEventRepository,
        private readonly settingsRepository: IAnalyticsSettingsRepository,
        private readonly ingestionService: TelemetryIngestionService
    ) {}

    async handle(command: RecordTelemetryEventCommand): Promise<MetricAcknowledgementDto> {
        const settings = await this.settingsRepository.getSettings();
        if (!settings) {
            throw new Error("Analytics settings not initialized.");
        }

        if (!PrivacyPolicy.canRecordMetric(settings.getOptOutStatus().isOptedOut())) {
            throw new Error("Analytics is opted out. Cannot record telemetry events.");
        }

        const aggregate = MetricAggregate.reconstitute({
            metrics: [],
            telemetryEvents: await this.telemetryEventRepository.getAll(),
            settings: { optOutStatus: settings.getOptOutStatus() }
        });

        const telemetryEvent = TelemetryEvent.create({
            eventType: command.eventType,
            payload: command.payload,
            piiMask: PIIMask.none(),
            correlationId: command.correlationId,
            engineSource: command.engineSource
        });

        const { event: sanitized, fieldsStripped } = this.ingestionService.ingest(telemetryEvent);

        aggregate.recordTelemetryEvent(
            sanitized.getEventType(),
            sanitized.getPayload(),
            PIIMask.create(sanitized.getPayload() ? Object.keys(sanitized.getPayload()).length : 0),
            sanitized.getCorrelationId(),
            sanitized.getEngineSource()
        );

        await this.telemetryEventRepository.save(sanitized);

        if (fieldsStripped.length > 0) {
            await this.eventBus.publish(new PIIStrippedEvent(fieldsStripped));
        }

        return new MetricAcknowledgementDto(sanitized.getId().getValue(), Date.now(), true);
    }
}
