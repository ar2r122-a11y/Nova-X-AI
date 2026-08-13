import { GetAnalyticsSettingsQuery } from "../Queries/GetAnalyticsSettingsQuery";
import { AnalyticsSettingsDto } from "../DTO/AnalyticsSettingsDto";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";

export class GetAnalyticsSettingsQueryHandler {
    constructor(private readonly settingsRepository: IAnalyticsSettingsRepository) {}

    async handle(query: GetAnalyticsSettingsQuery): Promise<AnalyticsSettingsDto> {
        if (!PrivacyPolicy.canAccessMetrics(query.requesterId, query.requesterId)) {
            throw new Error("Unauthorized: requester cannot access analytics settings.");
        }

        const settings = await this.settingsRepository.getSettings();
        if (!settings) {
            throw new Error("Analytics settings not initialized.");
        }

        return new AnalyticsSettingsDto(
            settings.getOptOutStatus().isOptedOut(),
            settings.getRetentionPeriod().getRawRetentionMs() / (24 * 60 * 60 * 1000),
            settings.getRetentionPeriod().getSummaryRetentionMs() / (24 * 60 * 60 * 1000),
            settings.isPIIStrippingEnabled(),
            settings.isPromptTextHashingEnabled(),
            settings.isIPAnonymizationEnabled(),
            settings.getUpdatedAt()
        );
    }
}
