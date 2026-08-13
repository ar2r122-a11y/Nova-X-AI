import type { IStorageEngine } from "@nova-x-ai/storage";
import { AnalyticsSettings } from "../../Domain/Entities/AnalyticsSettings";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";

interface StoredSettingsEntity {
    id: string;
    data: string;
}

export class AnalyticsSettingsRepositoryImpl implements IAnalyticsSettingsRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredSettingsEntity | null>;
        save(entity: StoredSettingsEntity): Promise<void>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredSettingsEntity>("analytics-settings");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity)
        };
    }

    async getSettings(): Promise<AnalyticsSettings | null> {
        const entity = await this.storageRepository.getById("global");
        if (!entity) return null;
        const data = JSON.parse(entity.data);
        return this.reconstitute(data);
    }

    async saveSettings(settings: AnalyticsSettings): Promise<void> {
        const snapshot = settings.toSnapshot();
        const serialized = JSON.stringify({
            id: snapshot.id,
            optOutStatus: snapshot.optOutStatus,
            retentionPeriod: {
                rawRetentionMs: snapshot.retentionPeriod.getRawRetentionMs(),
                summaryRetentionMs: snapshot.retentionPeriod.getSummaryRetentionMs()
            },
            piiStrippingEnabled: snapshot.piiStrippingEnabled,
            promptTextHashingEnabled: snapshot.promptTextHashingEnabled,
            ipAnonymizationEnabled: snapshot.ipAnonymizationEnabled,
            updatedAt: snapshot.updatedAt
        });
        const entity: StoredSettingsEntity = {
            id: "global",
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(data: any): AnalyticsSettings {
        const { OptOutStatus, RetentionPeriod } = require("../../Domain/ValueObjects");
        return AnalyticsSettings.reconstitute({
            id: data.id,
            optOutStatus: OptOutStatus.reconstitute(data.optOutStatus.optedOut, data.optOutStatus.updatedAt),
            retentionPeriod: RetentionPeriod.create(
                data.retentionPeriod.rawRetentionMs / (24 * 60 * 60 * 1000),
                data.retentionPeriod.summaryRetentionMs / (24 * 60 * 60 * 1000)
            ),
            piiStrippingEnabled: data.piiStrippingEnabled,
            promptTextHashingEnabled: data.promptTextHashingEnabled,
            ipAnonymizationEnabled: data.ipAnonymizationEnabled,
            updatedAt: data.updatedAt
        });
    }
}
