import { IEventStore, StorageEvent } from "@nova-x-ai/storage";
import { StoryEvent } from "../../Domain/Events/StoryEvent";

export interface StoryEventStoreOptions {
    readonly correlationId: string;
    readonly causationId?: string | null;
    readonly metadata?: Record<string, unknown>;
}

export class StoryEventStoreRepository {
    private readonly currentSchemaVersion = 1;

    constructor(private readonly eventStore: IEventStore) {}

    async append(streamId: string, eventType: string, payload: Record<string, unknown>, options: StoryEventStoreOptions): Promise<void> {
        const expectedVersion = await this.getStreamVersion(streamId);
        const version = expectedVersion + 1;
        const data = JSON.stringify({
            streamId,
            version,
            eventType,
            payload,
            timestamp: Date.now(),
            correlationId: options.correlationId,
            causationId: options.causationId ?? null,
            metadata: options.metadata ?? {},
            schemaVersion: this.currentSchemaVersion,
        });

        const checksum = this.computeChecksum(data);

        const storageEvent: StorageEvent = {
            eventId: `${streamId}-${version}`,
            streamId,
            eventType,
            data,
            version,
            timestamp: Date.now(),
            correlationId: options.correlationId,
            checksum,
        };

        await this.eventStore.appendToStream(streamId, [storageEvent], expectedVersion);
    }

    async readStream(streamId: string, fromVersion: number): Promise<StoryEvent[]> {
        const events = await this.eventStore.readStream(streamId, fromVersion);
        return events.map((e) => this.deserialize(e));
    }

    async getStreamVersion(streamId: string): Promise<number> {
        return this.eventStore.getStreamVersion(streamId);
    }

    async readStreamUpToVersion(streamId: string, upToVersion: number): Promise<StoryEvent[]> {
        const events = await this.eventStore.readStream(streamId, 0);
        return events
            .filter((e) => e.version <= upToVersion)
            .map((e) => this.deserialize(e));
    }

    async getStreamEvents(streamId: string): Promise<StoryEvent[]> {
        return this.readStream(streamId, 0);
    }

    subscribe(streamId: string, handler: (event: StoryEvent) => Promise<void>): () => void {
        const unwrapped = async (storageEvent: StorageEvent) => {
            const storyEvent = this.deserialize(storageEvent);
            await handler(storyEvent);
        };
        return this.eventStore.subscribeToStream(streamId, unwrapped);
    }

    private deserialize(event: StorageEvent): StoryEvent {
        const parsed: {
            streamId: string;
            version: number;
            eventType: string;
            payload: Record<string, unknown>;
            timestamp: number;
            correlationId: string;
            causationId: string | null;
            metadata: Record<string, unknown>;
            schemaVersion: number;
        } = JSON.parse(event.data as string);
        return {
            streamId: parsed.streamId,
            version: parsed.version,
            eventType: parsed.eventType,
            payload: parsed.payload,
            timestamp: parsed.timestamp,
            correlationId: parsed.correlationId,
            causationId: parsed.causationId,
            metadata: parsed.metadata,
            schemaVersion: parsed.schemaVersion,
        };
    }

    private computeChecksum(data: string): string {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `sha256-${Math.abs(hash).toString(16).padStart(8, "0")}`;
    }
}
