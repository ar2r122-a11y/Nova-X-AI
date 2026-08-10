export class WorldEventSerialization {
    static serialize(event: {
        streamId: string;
        version: number;
        eventType: string;
        payload: Record<string, unknown>;
        timestamp: number;
        correlationId: string;
        causationId: string | null;
        metadata: Record<string, unknown>;
        schemaVersion: number;
    }): unknown {
        return {
            streamId: event.streamId,
            version: event.version,
            eventType: event.eventType,
            payload: event.payload,
            timestamp: event.timestamp,
            correlationId: event.correlationId,
            causationId: event.causationId,
            metadata: event.metadata,
            schemaVersion: event.schemaVersion
        };
    }

    static deserialize(data: unknown): {
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
        if (!data || typeof data !== "object") {
            throw new Error("Invalid event data format.");
        }

        const record = data as Record<string, unknown>;

        return {
            streamId: typeof record.streamId === "string" ? record.streamId : "",
            version: typeof record.version === "number" ? record.version : 0,
            eventType: typeof record.eventType === "string" ? record.eventType : "",
            payload: typeof record.payload === "object" && record.payload !== null ? record.payload as Record<string, unknown> : {},
            timestamp: typeof record.timestamp === "number" ? record.timestamp : 0,
            correlationId: typeof record.correlationId === "string" ? record.correlationId : "",
            causationId: typeof record.causationId === "string" ? record.causationId : null,
            metadata: typeof record.metadata === "object" && record.metadata !== null ? record.metadata as Record<string, unknown> : {},
            schemaVersion: typeof record.schemaVersion === "number" ? record.schemaVersion : 1
        };
    }

    static computeChecksum(data: unknown): string {
        const json = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < json.length; i++) {
            const char = json.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `sha256-${Math.abs(hash).toString(16).padStart(8, "0")}`;
    }
}
