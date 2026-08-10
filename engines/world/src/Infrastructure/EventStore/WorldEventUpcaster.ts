import { StorageEvent } from "@nova-x-ai/storage";

export interface UpcastResult {
    readonly eventType: string;
    readonly version: number;
    readonly payload: Record<string, unknown>;
}

export class WorldEventUpcaster {
    private readonly upcasters = new Map<string, (event: Record<string, unknown>) => Record<string, unknown>>();

    registerUpcaster(eventType: string, upcaster: (event: Record<string, unknown>) => Record<string, unknown>): void {
        this.upcasters.set(eventType, upcaster);
    }

    upcast(events: StorageEvent[]): import("./WorldEventStore").WorldEvent[] {
        return events.map(storageEvent => {
            const deserialized = this.deserializeStorageEvent(storageEvent);
            const upcastedPayload = this.applyUpcasters(deserialized.eventType, deserialized.payload);
            return {
                streamId: deserialized.streamId,
                version: deserialized.version,
                eventType: deserialized.eventType,
                payload: upcastedPayload,
                timestamp: deserialized.timestamp,
                correlationId: deserialized.correlationId,
                causationId: deserialized.causationId,
                metadata: deserialized.metadata,
                schemaVersion: deserialized.schemaVersion
            };
        });
    }

    private deserializeStorageEvent(storageEvent: StorageEvent): {
        streamId: string;
        version: number;
        eventType: string;
        payload: Record<string, unknown>;
        timestamp: number;
        correlationId: string;
        causationId: string | null;
        metadata: Record<string, unknown>;
        schemaVersion: number;
    } {
        const data = storageEvent.data;
        if (!data || typeof data !== "object") {
            return {
                streamId: storageEvent.streamId,
                version: storageEvent.version,
                eventType: storageEvent.eventType,
                payload: {},
                timestamp: storageEvent.timestamp,
                correlationId: storageEvent.correlationId,
                causationId: null,
                metadata: {},
                schemaVersion: 1
            };
        }

        const record = data as Record<string, unknown>;
        return {
            streamId: typeof record.streamId === "string" ? record.streamId : storageEvent.streamId,
            version: typeof record.version === "number" ? record.version : storageEvent.version,
            eventType: typeof record.eventType === "string" ? record.eventType : storageEvent.eventType,
            payload: typeof record.payload === "object" && record.payload !== null ? record.payload as Record<string, unknown> : {},
            timestamp: typeof record.timestamp === "number" ? record.timestamp : storageEvent.timestamp,
            correlationId: typeof record.correlationId === "string" ? record.correlationId : storageEvent.correlationId,
            causationId: typeof record.causationId === "string" ? record.causationId : null,
            metadata: typeof record.metadata === "object" && record.metadata !== null ? record.metadata as Record<string, unknown> : {},
            schemaVersion: typeof record.schemaVersion === "number" ? record.schemaVersion : 1
        };
    }

    private applyUpcasters(eventType: string, payload: Record<string, unknown>): Record<string, unknown> {
        const upcaster = this.upcasters.get(eventType);
        if (!upcaster) {
            return payload;
        }
        return upcaster({ ...payload });
    }
}
