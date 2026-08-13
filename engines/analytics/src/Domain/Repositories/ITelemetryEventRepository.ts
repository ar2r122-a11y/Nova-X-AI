import { TelemetryEvent } from "../Entities/TelemetryEvent";

export interface ITelemetryEventRepository {
    save(event: TelemetryEvent): Promise<void>;
    getById(id: string): Promise<TelemetryEvent | null>;
    getAll(): Promise<TelemetryEvent[]>;
    getByType(eventType: string): Promise<TelemetryEvent[]>;
    getByTimeRange(start: number, end: number): Promise<TelemetryEvent[]>;
    delete(id: string): Promise<void>;
    deleteExpired(before: number): Promise<number>;
}
