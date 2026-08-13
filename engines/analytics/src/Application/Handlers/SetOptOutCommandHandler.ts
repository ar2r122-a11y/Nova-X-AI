import type { IEventBus } from "@nova-x-ai/core";
import { SetOptOutCommand } from "../Commands/SetOptOutCommand";
import { AnalyticsSettingsDto } from "../DTO/AnalyticsSettingsDto";
import { AnalyticsOptOutChangedEvent } from "../../Domain/Events/AnalyticsOptOutChangedEvent";
import { OptOutPolicy } from "../../Domain/Policies/OptOutPolicy";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";
import { AnalyticsSettings } from "../../Domain/Entities/AnalyticsSettings";
import { OptOutStatus } from "../../Domain/ValueObjects/OptOutStatus";

export class SetOptOutCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly settingsRepository: IAnalyticsSettingsRepository
    ) {}

    async handle(command: SetOptOutCommand): Promise<AnalyticsSettingsDto> {
        const settings = await this.settingsRepository.getSettings();
        if (!settings) {
            throw new Error("Analytics settings not initialized.");
        }

        OptOutPolicy.validateOptOutChange(settings.getOptOutStatus().isOptedOut(), command.optedOut);

        const updatedProps = {
            ...settings.toSnapshot(),
            optOutStatus: OptOutStatus.reconstitute(command.optedOut, Date.now()),
            updatedAt: Date.now()
        };
        const updated = AnalyticsSettings.reconstitute(updatedProps);
        await this.settingsRepository.saveSettings(updated);

        await this.eventBus.publish(new AnalyticsOptOutChangedEvent(command.optedOut));

        return new AnalyticsSettingsDto(
            updated.getOptOutStatus().isOptedOut(),
            updated.getRetentionPeriod().getRawRetentionMs() / (24 * 60 * 60 * 1000),
            updated.getRetentionPeriod().getSummaryRetentionMs() / (24 * 60 * 60 * 1000),
            updated.isPIIStrippingEnabled(),
            updated.isPromptTextHashingEnabled(),
            updated.isIPAnonymizationEnabled(),
            updated.getUpdatedAt()
        );
    }
}
