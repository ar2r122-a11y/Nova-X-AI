import { AnalyticsSettings } from "../Entities/AnalyticsSettings";

export interface IAnalyticsSettingsRepository {
    getSettings(): Promise<AnalyticsSettings | null>;
    saveSettings(settings: AnalyticsSettings): Promise<void>;
}
