import type { IStorageEngine } from "@nova-x-ai/storage";
import { Metric } from "../../Domain/Entities/Metric";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";

interface StoredMetricEntity {
    id: string;
    data: string;
}

export class MetricRepositoryImpl implements IMetricRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredMetricEntity | null>;
        save(entity: StoredMetricEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredMetricEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredMetricEntity>("analytics-metrics");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async save(metric: Metric): Promise<void> {
        const snapshot = metric.toSnapshot();
        const serialized = JSON.stringify({
            id: snapshot.id.getValue(),
            type: snapshot.type,
            name: snapshot.name,
            value: { value: snapshot.value.getValue(), unit: snapshot.value.getUnit() },
            tags: snapshot.tags,
            featureTag: snapshot.featureTag?.getValue(),
            performanceTag: snapshot.performanceTag?.getValue(),
            piiMask: snapshot.piiMask,
            recordedAt: snapshot.recordedAt,
            sessionId: snapshot.sessionId,
            engineSource: snapshot.engineSource,
            correlationId: snapshot.correlationId
        });
        const entity: StoredMetricEntity = {
            id: snapshot.id.getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async getById(id: string): Promise<Metric | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) return null;
        const data = JSON.parse(entity.data);
        return this.reconstitute(data);
    }

    async getAll(): Promise<Metric[]> {
        const entities = await this.storageRepository.getAll();
        return entities.map((entity) => this.reconstitute(JSON.parse(entity.data)));
    }

    async getByType(type: string): Promise<Metric[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getType() === type);
    }

    async getByFeature(feature: string): Promise<Metric[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getFeatureTag()?.getValue() === feature);
    }

    async getByPerformance(performance: string): Promise<Metric[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getPerformanceTag()?.getValue() === performance);
    }

    async getByTimeRange(start: number, end: number): Promise<Metric[]> {
        const all = await this.getAll();
        return all.filter((m) => m.getRecordedAt() >= start && m.getRecordedAt() <= end);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async deleteExpired(before: number): Promise<number> {
        const all = await this.getAll();
        const expired = all.filter((m) => m.getRecordedAt() < before);
        let deleted = 0;
        for (const metric of expired) {
            await this.storageRepository.delete(metric.getId().getValue());
            deleted++;
        }
        return deleted;
    }

    private reconstitute(data: any): Metric {
        const { MetricId, MetricValue, FeatureTag, PerformanceTag, PIIMask } = require("../../Domain/ValueObjects");
        return Metric.reconstitute({
            id: MetricId.fromString(data.id),
            type: data.type,
            name: data.name,
            value: MetricValue.create(data.value.value, data.value.unit),
            tags: data.tags,
            featureTag: data.featureTag ? FeatureTag.create(data.featureTag) : undefined,
            performanceTag: data.performanceTag ? PerformanceTag.create(data.performanceTag) : undefined,
            piiMask: data.piiMask.masked ? PIIMask.create(data.piiMask.originalLength) : PIIMask.none(),
            recordedAt: data.recordedAt,
            sessionId: data.sessionId,
            engineSource: data.engineSource,
            correlationId: data.correlationId
        });
    }
}
