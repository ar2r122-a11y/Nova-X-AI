import { WorldEventVersion } from "../ValueObjects/WorldEventVersion";

export class WorldHistoryEntry {
    private readonly version: WorldEventVersion;
    private readonly eventType: string;
    private readonly timestamp: number;
    private readonly payload: Record<string, unknown>;
    private readonly correlationId: string;

    private constructor(version: WorldEventVersion, eventType: string, timestamp: number, payload: Record<string, unknown>, correlationId: string) {
        this.version = version;
        this.eventType = eventType;
        this.timestamp = timestamp;
        this.payload = payload;
        this.correlationId = correlationId;
    }

    static create(version: WorldEventVersion, eventType: string, timestamp: number, payload: Record<string, unknown>, correlationId: string): WorldHistoryEntry {
        if (!eventType || eventType.trim().length === 0) {
            throw new Error("EventType cannot be empty.");
        }
        return new WorldHistoryEntry(version, eventType.trim(), timestamp, payload, correlationId);
    }

    getVersion(): WorldEventVersion {
        return this.version;
    }

    getEventType(): string {
        return this.eventType;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getPayload(): Record<string, unknown> {
        return this.payload;
    }

    getCorrelationId(): string {
        return this.correlationId;
    }
}
