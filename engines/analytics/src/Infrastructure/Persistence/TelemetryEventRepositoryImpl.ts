import type { IStorageEngine } from "@nova-x-ai/storage";
import { TelemetryEvent } from "../../Domain/Entities/TelemetryEvent";
import type { ITelemetryEventRepository } from "../../Domain/Repositories/ITelemetryEventRepository";

interface StoredTelemetryEntity {
    id: string;
    data: string;
}

export class TelemetryEventRepositoryImpl implements ITelemetryEventRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredTelemetryEntity | null>;
        save(entity: StoredTelemetryEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredTelemetryEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredTelemetryEntity>("analytics-telemetry");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async save(event: TelemetryEvent): Promise<void> {
        const snapshot = event.toSnapshot();
        const serialized = JSON.stringify({
            id: snapshot.id.getValue(),
            eventType: snapshot.eventType,
            payload: snapshot.payload,
            piiMask: snapshot.piiMask,
            timestamp: snapshot.timestamp,
            correlationId: snapshot.correlationId,
            engineSource: snapshot.engineSource
        });
        const entity: StoredTelemetryEntity = {
            id: snapshot.id.getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    async getById(id: string): Promise<TelemetryEvent | null> {
        const entity = await this.storageRepository.getById(id);
        if (!entity) return null;
        const data = JSON.parse(entity.data);
        return this.reconstitute(data);
    }

    async getAll(): Promise<TelemetryEvent[]> {
        const entities = await this.storageRepository.getAll();
        return entities.map((entity) => this.reconstitute(JSON.parse(entity.data)));
    }

    async getByType(eventType: string): Promise<TelemetryEvent[]> {
        const all = await this.getAll();
        return all.filter((e) => e.getEventType() === eventType);
    }

    async getByTimeRange(start: number, end: number): Promise<TelemetryEvent[]> {
        const all = await this.getAll();
        return all.filter((e) => e.getTimestamp() >= start && e.getTimestamp() <= end);
    }

    async delete(id: string): Promise<void> {
        await this.storageRepository.delete(id);
    }

    async deleteExpired(before: number): Promise<number> {
        const all = await this.getAll();
        const expired = all.filter((e) => e.getTimestamp() < before);
        let deleted = 0;
        for (const event of expired) {
            await this.storageRepository.delete(event.getId().getValue());
            deleted++;
        }
        return deleted;
    }

    private reconstitute(data: any): TelemetryEvent {
        const { TelemetryEventId, PIIMask } = require("../../Domain/ValueObjects");
        return TelemetryEvent.reconstitute({
            id: TelemetryEventId.fromString(data.id),
            eventType: data.eventType,
            payload: data.payload,
            piiMask: data.piiMask.masked ? PIIMask.create(data.piiMask.originalLength) : PIIMask.none(),
            timestamp: data.timestamp,
            correlationId: data.correlationId,
            engineSource: data.engineSource
        });
    }
}
