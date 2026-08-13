import { UpdatePrivacySettingsCommand } from "../Commands/UpdatePrivacySettingsCommand";
import { AnalyticsSettingsDto } from "../DTO/AnalyticsSettingsDto";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";
import { AnalyticsSettings } from "../../Domain/Entities/AnalyticsSettings";

export class UpdatePrivacySettingsCommandHandler {
    constructor(private readonly settingsRepository: IAnalyticsSettingsRepository) {}

    async handle(command: UpdatePrivacySettingsCommand): Promise<AnalyticsSettingsDto> {
        const settings = await this.settingsRepository.getSettings();
        if (!settings) {
            throw new Error("Analytics settings not initialized.");
        }

        const updatedProps = {
            ...settings.toSnapshot(),
            piiStrippingEnabled: command.piiStrippingEnabled,
            promptTextHashingEnabled: command.promptTextHashingEnabled,
            ipAnonymizationEnabled: command.ipAnonymizationEnabled,
            updatedAt: Date.now()
        };
        const updated = AnalyticsSettings.reconstitute(updatedProps);
        await this.settingsRepository.saveSettings(updated);

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
